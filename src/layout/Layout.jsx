import React, { Component } from 'react'
import './w3.css'
import './raleway.css'

import fetchContent from './fetchContent'

/* const dump = d => {
  console.log(d)
  return d
} */
const items = () => fetchContent()
console.log(items);
const toHref = da => da.fields.native.links[0].href

export default class Layout extends Component {
  render () {
    return (
      <div>
        <Body />
      </div>
    )
  }
}
const w100pct = { width: '100%' }
const w50pct = { width: '50%' }

const Body = () => (
  <div className='w3-light-grey'>
    <div className='w3-content' style={{ maxWidth: '1400px' }}>
      <Header />
      <div className='w3-row'>
        <div className='w3-col l12 m12 s12'>
          <Blogs />
        </div>
      </div>
      <br />
    </div>
    <Footer />
  </div>
)

const Header = () => (
  <header className='w3-container w3-center w3-padding-32'>
      
  </header>
)

const Footer = () => (
  <footer className='w3-container w3-dark-grey w3-padding-32 w3-margin-top'>
    <p>
      Powered by{' '}
      <a href='https://www.w3schools.com/w3css/default.asp'>
        w3.css
      </a>
    </p>
  </footer>
)

class Blogs extends Component {
  constructor (props) {
    super(props)
    this.state = { items: [] }
  }
  componentDidMount () {
    items().then(data => {
        console.log(data)
        
        const banner = data.ALL.items.filter(
          item => item.type === 'Match-Hero-Header'
        )
        console.log(banner);
        const items = data.items
        this.setState({ items:items })
        this.setState({ banner:banner }) 
        console.log(this)
      })
      .catch(err => {
        console.error(err)
        this.setState({ err: err.toString() })
      })
  }
  render () {   
    const child = this.state.err ? (
    <ErrorComponent err={this.state.err} />
    ) : this.state.items.length === 0 ? (
    <NoItems />
    ) : (
    <Banner item={this.state.banner} /> && <List items={this.state.items} />)
    return child
  }
}

const ErrorComponent = props => <div>{props.err}</div>

const NoItems = () => <div>No items to display</div>

const List = props => {
  return (
    <div>
      {props.items.map((item, index) => (
        <Blog key={index} item={item} />
      ))}
    </div>
  )
}

const dateToMDY = date =>
  new Date(date.value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

// definition for Blog component
const Blog = ({ item }) => {
  const { fields } = item
  const {
    author,
    media,
    publishDate,
    subtitle
  } = fields
  // const content = { __html: body } // to be used with dangerouslySetInnerHTML
  const image = toHref(media)
  const date = dateToMDY( publishDate)

  return (
    <div className='w3-col l4 m6 s12 w3-margin w3-white' style={{ maxWidth: '430px' }}>
      <img src={image} alt={item.name} style={w100pct} />
      <div className='w3-container'>
        <h3>
          <b>{item.name}</b>
        </h3>
        <h5>
          {author}, <span className='w3-opacity'>{date}</span>
        </h5>
      </div>

      <div className='w3-container'><p>{subtitle}</p></div>
    </div>
  )
}

// definition for Banner component
const Banner = ({ item }) => {
  const { fields } = item
  const {
    team_1_name,
    team_1_logo,
    team_2_name,
    team_2_logo,
    banner,
    score
  } = fields

  const team_1_logo_url = toHref(team_1_logo)
  const team_2_logo_url = toHref(team_2_logo)
  const banner_url = toHref(banner)

return (
  <div>
    <img src={team_1_logo_url} alt={item.name} style={w50pct} />
    <h3>{team_1_name}<br />{score}<br />{team_2_name}</h3>
    <img src={team_2_logo_url} alt={item.name} style={w50pct} />
    <img src={banner_url} alt={item.name} />
  </div>
  )
}

