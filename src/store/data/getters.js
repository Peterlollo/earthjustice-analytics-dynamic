export const providers = state => state.data.providers
export const pages = state => state.data.pages
export const pageviews = state => state.data.pageviews
export const pagePathFromParam = state => state.data.pagePathFromParam
export const pagePathFromParamStatus = state => state.data.pagePathFromParamStatus
export const fetchingData = state => state.data.fetchingData
export const pageFoundInStore = state => state.data.pageFoundInStore
export const error = state => state.data.error
// export const isViewingProvider = state => {
//   let providerID = state.data.isViewingProvider
//   if (!providerID) {
//     return {
//       provider: { name: 'Choose a company to view' },
//       sessionsPageviews: []
//     }
//   } else {
//     let provider = state.data.providers.filter((p) => p.id === providerID)[0]
//     let sessions = state.data.sessions.filter((s) => s.provider === providerID)
//     let pageviews = state.data.pageviews
//     let sessionIdsFromPageviews = state.data.pageviews.map((v) => v.session)
//     let sessionsPageviews = sessions.filter((s) => {
//       return sessionIdsFromPageviews.indexOf(s.id) > -1
//     }).map((sess) => {
//       sess.views = []
//       pageviews.forEach((v) => {
//         if (v.session === sess.id) {
//           sess.views.push(v)
//         }
//       })
//       return sess
//     })
//     return {provider, sessionsPageviews}
//   }
// }

// export const providersWithPageviews = state => {
//   let sessionIdsFromPageviews = state.data.pageviews.map((v) => v.session)
//   let sessions = state.data.sessions.filter((s) => (sessionIdsFromPageviews.indexOf(s.id) > -1))
//   let providerIdsFromSessions = sessions.map((s) => s.provider)
//   let providers = state.data.providers.filter((p) => (providerIdsFromSessions.indexOf(p.id) > -1))
//   return providers
// }

// export const isViewingPage = state => {
//   return state.data.isViewingPage
// }

// export const allViewsOfCurrentPage = state => {
//   let page = state.data.isViewingPage
//   return page.id ? state.data.pageviews.filter((pv) => pv.page === page.id) : []
// }

// export const providersAndTimesGroupedForViewsOfCurrentPage = (state, get) => {
//   let providerTimes = {}
//   let page = state.data.isViewingPage
//   if (!page.id) { // if no page is currently being viewed, return []
//     return []
//   }
//   // find all pageviews associated with current page
//   let pageviews = state.data.pageviews.filter((pv) => pv.page === page.id)
//   pageviews.forEach((pv) => {
//     // get provider id for all pageviews
//     let providerID = pv.provider
//     if (providerTimes[providerID]) {
//       // create object which groups pageviews by provider and sums the seconds spent on page
//       providerTimes[providerID] = providerTimes[providerID] + pv.seconds
//     } else {
//       providerTimes[providerID] = pv.seconds
//     }
//   })
//   // create an array with tuples of [providerID, seconds]
//   var sortedProviderTimes = []
//   for (var provider in providerTimes) {
//     sortedProviderTimes.push([Number(provider), providerTimes[provider]])
//   }
//   // sort tuples array by seconds, descending
//   sortedProviderTimes.sort(function (a, b) {
//     return b[1] - a[1]
//   })

//   return sortedProviderTimes
// }

// export const keyProviderIds = state => { // return array of key provider ids
//   let keyProviders = state.data.providers.filter((p) => p.important === true)
//   return keyProviders.length ? keyProviders.map((provider) => { return provider.id }) : []
// }

// export const currentPageWithTimesKeyProviders = (state, get) => { // return array of key providers with time spent on page
//   return get.providersAndTimesGroupedForViewsOfCurrentPage.filter((p) => get.keyProviderIds.indexOf(p[0]) > -1)
// }

// export const currentPageWithTimesNotKeyProviders = (state, get) => { // return array of NON key providers with time spent on page
//   return get.providersAndTimesGroupedForViewsOfCurrentPage.filter((p) => get.keyProviderIds.indexOf(p[0]) === -1)
// }
