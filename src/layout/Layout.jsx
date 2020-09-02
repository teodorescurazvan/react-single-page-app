import React, { Component } from 'react'
import './w3.css'
import './raleway.css'

import fetchContent from './fetchContent'

const dump = d => {
  console.log(d)
  return d
}
const items = () => fetchContent()

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
const w50px = { width: '50px' }

const Body = () => (
  <div className='w3-light-grey'>
    <div className='w3-content' style={{ maxWidth: '1400px' }}>
      <Header />
      <div className='w3-row'>
          <Blogs />
      </div>
      <br />
    </div>
    <Footer />
  </div>
)

const Header = () => (
  <header className='w3-container w3-padding-32'>
    <Banner />
  </header>
)

const Footer = () => (
  <footer className='w3-container w3-dark-grey w3-padding-32 w3-margin-top'>
    <p>
      Powered by{' '}
      <a href='http://www.oracle.com' target='_blank' rel="noopener noreferrer">
        Oracle
      </a>
    </p>
  </footer>
)

/* const AboutCard = () => (
  <div className='w3-card w3-margin w3-margin-top'>
    <img src='/w3images/supporter_club.jpg' style={w100pct} alt="supporter club" />
    <div className='w3-container w3-white'>
      <h4>
        <b>Tell us the story of your supporters club</b>
      </h4>
      <p>
      A brief history of how the Supporters' Club came to be, the biggest 
      events you've attended together as group… Don't forget details like 
      the founding year, number or members, and the board of directors.
      </p>
    </div>
  </div>
) */

/* const PopularPosts = () => (
  <div className='w3-card w3-margin'>
    <div className='w3-container w3-padding'>
      <h4>Popular Posts</h4>
    </div>
    <ul className='w3-ul w3-hoverable w3-white'>
      <li className='w3-padding-16'>
        <img src='/w3images/workshop.jpg' alt='workshop' className='w3-left w3-margin-right' style={w50px} />
        <span className='w3-large'>Lorem</span>
        <br />
        <span>Sed mattis nunc</span>
      </li>
      <li className='w3-padding-16'>
        <img src='/w3images/gondol.jpg' alt='gondol' className='w3-left w3-margin-right' style={w50px} />
        <span className='w3-large'>Ipsum</span>
        <br />
        <span>Praes tinci sed</span>
      </li>
      <li className='w3-padding-16'>
        <img src='/w3images/skies.jpg' alt='skies' className='w3-left w3-margin-right' style={w50px} />
        <span className='w3-large'>Dorum</span>
        <br />
        <span>Ultricies congue</span>
      </li>
      <li className='w3-padding-16 w3-hide-medium w3-hide-small'>
        <img src='/w3images/rock.jpg' alt='rock' className='w3-left w3-margin-right' style={w50px} />
        <span className='w3-large'>Mingsum</span>
        <br />
        <span>Lorem ipsum dipsum</span>
      </li>
    </ul>
  </div>
) */

class Blogs extends Component {
  constructor (props) {
    super(props)
    this.state = { items: [] }
  }
  componentDidMount () {
    items().then(data => {
        console.log(data)
        
        const blogs = data.ALL.items.filter(
          item => item.type === 'Story'
        )
        const items = data.items
        this.setState({ items:items })
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
      <List items={this.state.items} />
    )
    return child
  }
}

class Banner extends Component {
  constructor (props) {
    super(props)
    this.state = { items: [] }
  }
  componentDidMount() {
    items().then(data => {
      console.log(data)
      
      const banner = data.ALL.items.filter(
        item => item.type === 'Match-Hero-Header'
      )
      const items = data.items
      this.setState({ items:items })
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
      <List items={this.state.items} />
    )
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

const Blog = ({ item }) => {
  const { fields } = item
  const {
    author,
    body,
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
