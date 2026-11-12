CAREER CENTER KPI SHOW/HIDE — PRODUCTION CANDIDATE

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
1. cd into this extracted folder.
2. Run:
       python3 -m http.server 8765
3. In Tableau, load the extension using:
       CareerCenter_KPI_ShowHide_Production_v2.trex

DEBUG
-----
If needed, open config.js and change:
    debug: false
to:
    debug: true

The extension will then report exactly which whitelisted filters it found and
which of them are active.
