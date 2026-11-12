(() => {
  "use strict";

  const cfg = window.CC_KPI_CONFIG || {};
  const DEBUG = !!cfg.debug;
  const WATCHED = new Set(cfg.watchedFilters || []);
  const IGNORED = new Set(cfg.ignoredFilters || []);
  const TARGETS = cfg.dashboardTargets || {};

  let dashboard;
  let timer = null;
  let busy = false;
  let rerun = false;

  const debugEl = document.getElementById("debug");

  function dbg(message, cls="") {
    if (!DEBUG) {
      debugEl.style.display = "none";
      return;
    }
    debugEl.style.display = "block";
    debugEl.className = cls;
    debugEl.textContent = message;
  }

  function norm(s) {
    return (s || "").trim().toLowerCase();
  }

  function resolveTargetNames() {
    const dname = norm(dashboard.name);

    // First: exact-ish dashboard name configuration.
    for (const [key, names] of Object.entries(TARGETS)) {
      if (dname === norm(key) || dname.includes(norm(key))) {
        return names;
      }
    }

    // Fallback: no configured dashboard match.
    return [];
  }

  function findTargetObject() {
    const configured = resolveTargetNames();

    for (const name of configured) {
      const hit = dashboard.objects.find(o => norm(o.name) === norm(name));
      if (hit) return hit;
    }

    // Safe fallback: exactly one dashboard object with KPI + Subgroup in its name.
    const fallback = dashboard.objects.filter(o => {
      const n = norm(o.name);
      return n.includes("kpi") && n.includes("subgroup");
    });

    return fallback.length === 1 ? fallback[0] : null;
  }

  async function getRelevantFilters() {
    const filters = await dashboard.getFiltersAsync();

    // Strict whitelist. Anything not explicitly named in watchedFilters
    // cannot trigger the subgroup KPI.
    return filters.filter(f =>
      WATCHED.has(f.fieldName) &&
      !IGNORED.has(f.fieldName)
    );
  }

  function filterIsActive(f) {
    // For ordinary categorical quick filters, isAllSelected is the signal we want.
    return typeof f.isAllSelected === "boolean" && f.isAllSelected === false;
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(update, 100);
  }

  async function update() {
    if (busy) {
      rerun = true;
      return;
    }

    busy = true;
    try {
      const target = findTargetObject();
      if (!target) {
        dbg(
          `No subgroup KPI target found on dashboard "${dashboard.name}". ` +
          `Available KPI/Subgroup objects: ` +
          dashboard.objects
            .filter(o => norm(o.name).includes("kpi") || norm(o.name).includes("subgroup"))
            .map(o => o.name)
            .join(", "),
          "err"
        );
        return;
      }

      const relevant = await getRelevantFilters();
      const active = relevant.filter(filterIsActive);
      const shouldShow = active.length > 0;

      const visibility = {};
      visibility[target.id] = shouldShow
        ? tableau.ZoneVisibilityType.Show
        : tableau.ZoneVisibilityType.Hide;

      await dashboard.setZoneVisibilityAsync(visibility);

      dbg(
        `${shouldShow ? "Showing" : "Hiding"} '${target.name}'. ` +
        `Active visible subgroup filter(s): ` +
        (active.length ? active.map(f => f.fieldName).join(", ") : "None") +
        `. Watched filters found: ` +
        (relevant.length ? relevant.map(f => f.fieldName).join(", ") : "None"),
        "ok"
      );
    } catch (e) {
      dbg(`Error: ${e && e.message ? e.message : String(e)}`, "err");
    } finally {
      busy = false;
      if (rerun) {
        rerun = false;
        schedule();
      }
    }
  }

  async function init() {
    try {
      await tableau.extensions.initializeAsync();
      dashboard = tableau.extensions.dashboardContent.dashboard;

      // Listen on all worksheets because dashboard quick-filter changes
      // can be raised by the worksheets they apply to.
      dashboard.worksheets.forEach(ws => {
        ws.addEventListener(tableau.TableauEventType.FilterChanged, schedule);
      });

      await update();
    } catch (e) {
      dbg(`Initialization error: ${e && e.message ? e.message : String(e)}`, "err");
    }
  }

  init();
})();
