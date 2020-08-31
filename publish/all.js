const fetch = require('node-fetch')
const fs = require('fs')

const contentTypes = ['Maximum_Article', 'Maximum_Tire']
const token = '2098fc4952037dd5ad3f379904fbbf49'

const host = 'https://workshop2content-oce0002.cec.ocp.oraclecloud.com'

const itemsURL = ({ maxResults, sortOrder }) =>
  `${host}/content/published/api/v1.1/items?orderBy=${esc(
    sortOrder
  )}&limit=${maxResults}&channelToken=${token}&links=self`

const dump = s => {
  console.log(JSON.stringify(s, null, 2))
  return s
}

const write = data => {
  fs.writeFileSync('src/data/content/all.json', JSON.stringify(data, null, 2))
  return data
}

const queryOp = ({ maxResults, sortOrder }) => ({
  maxResults,
  sortOrder
})

const esc = encodeURIComponent
const key = ({ maxResults, sortOrder }) => `ALL;${maxResults};${sortOrder}`

const fetchItem = link => {
  return fetch(`${link.href}&expand=all`)
    .then(r => r.json())
    .then(data => ({ [link.id]: { data: data } }))
}
const fetchItems = data => {
  // console.log(JSON.stringify(data,null,2))
  const links = Object.values(data)
    .map(e =>
      e.data.items
        .filter(e => e.type !== 'DigitalAsset')
        .map(e => ({ id: e.id, href: e.links[0].href }))
    )
    .reduce((a, e) => a.concat(e), [])
    .sort((a, b) => a.href.localeCompare(b.href))
    .filter((e, i, a) => a.indexOf(e) === i)
  const itemFetches = links.map(fetchItem)
  return Promise.all(itemFetches)
    .then(a => a.reduce((a, e) => Object.assign(a, e), {}))
    .then(r => Object.assign(data, r))
}
const fetches = Promise.all(
  [{ maxResults: 500, sortOrder: 'updatedDate:des' }].map(e =>
    fetch(itemsURL(e))
      .then(response => response.json())
      .then(data => ({ ALL: { data: data, query: queryOp(e) } }))
  )
)
fetches
  .then(a => a.reduce((a, e) => Object.assign(a, e), {}))
  .then(fetchItems)
  .then(write)
