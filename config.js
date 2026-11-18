window.CC_KPI_CONFIG = {
  debug: false,

  // ONLY user-facing demographic/subgroup quick filters belong here.
  watchedFilters: [
    "Sex",
    "Ethnicity IPEDS",
    "Degree",
    "Primary Program",
    "School",
    "Academic Class",
    "Academic Cluster",
    "Work Authorization",
    "Work Authorization Final"
  ],

  // Academic Year is intentionally ignored.
  ignoredFilters: [
    "Academic Year"
  ],

  dashboardTargets: {
    "Overall Engagement": [
      "Overall KPI - Subgroup"
    ],
    "Events": [
      "Events KPI - Subgroup",
      "Event KPI - Subgroup"
    ],
    "Appointments": [
      "Appointments KPI - Subgroup",
      "Appointment KPI - Subgroup"
    ],
    "Asynchronous": [
      "Asynchronous KPI - Subgroup",
      "Async KPI - Subgroup"
    ]
  }
};
