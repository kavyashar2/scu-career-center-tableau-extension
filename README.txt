CAREER CENTER KPI SHOW/HIDE — PRODUCTION CANDIDATE V2

WHAT CHANGED
------------
V2 uses a STRICT whitelist of only user-facing demographic quick filters.

It DOES NOT watch:
- Academic Year
- CC Population Tier Final
- Population Tier
- hidden eligibility/model filters

Watched fields:
- Sex
- Ethnicity IPEDS
- Degree
- Primary Program
- School
- Academic Cluster
- Work Authorization
- Work Authorization Final

EXPECTED BEHAVIOR
-----------------
All watched demographic filters = (All)
    -> subgroup KPI hides

Academic Year changes by itself
    -> subgroup KPI stays hidden

Any watched demographic filter is narrowed
    -> subgroup KPI shows

Reset demographics to (All)
    -> subgroup KPI hides

LOCAL TEST
----------
1. Stop the previous localhost server with Ctrl+C.
2. cd into this extracted folder.
3. Run:
       python3 -m http.server 8765
4. In Tableau, replace/reload the extension using:
       CareerCenter_KPI_ShowHide_Production_v2.trex
5. Make sure native "Control visibility using value" is OFF on the subgroup KPI
   while the extension controls it.

DEBUG
-----
If needed, open config.js and change:
    debug: false
to:
    debug: true

The extension will then report exactly which whitelisted filters it found and
which of them are active.

IMPORTANT
---------
If the visible Tableau field name differs from the names above, add the exact
field name to watchedFilters in config.js. Do NOT add internal filters merely
because they appear in Tableau's filter metadata.
