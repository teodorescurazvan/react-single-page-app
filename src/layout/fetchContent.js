/* Define front-end properties - Start */
const token = 'a5e4f2d801eb4d338a7aad40a86544d5'
const taxonomyCatId = ''
const containerAssetID = ''
const host = 'https://demo-oce0002.cec.ocp.oraclecloud.com/'
/* Define front-end properties - End */

const itemsURL = ({ maxResults, sortOrder }) =>
  `${host}/content/published/api/v1.1/items?orderBy=${esc(sortOrder)}&limit=${maxResults}&channelToken=${token}`

const esc = encodeURIComponent

const noDigitalAssets = e => e.type !== 'DigitalAsset'

const fetchItem = link => {
  return fetch(`${link.href}&expand=all`)
    .then(r => r.json())
}
const fetchItems = data => {
  const {ALL}= data
  const links = ALL.items
    .filter(noDigitalAssets)
    .map(e => ({ id: e.id, href: e.links[0].href }))
  const itemFetches = links.map(fetchItem)
  return Promise.all(itemFetches).then(data => ({ALL, items:data}))
}
const fetches = ()=> fetch(
  itemsURL({ maxResults: 500, sortOrder: 'updatedDate:des' })
)
  .then(response => response.json())
  .then(data => ({ ALL: data }))

const all = () => fetches().then(fetchItems)

export default all
