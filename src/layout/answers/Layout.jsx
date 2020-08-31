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
        <div className='w3-col l8 s12'>
          <Blogs />
        </div>
        <div className='w3-col l4'>
          <AboutCard />
          <hr />
          <PopularPosts />
        </div>
      </div>
      <br />
    </div>
    <Footer />
  </div>
)

const Header = () => (
  <header className='w3-container w3-center w3-padding-32'>
    <h1>
      <b>Car Lovers Blog</b>
    </h1>
    <p>
      The blog of <span className='w3-tag'>Car Lovers</span>
    </p>
  </header>
)

const Footer = () => (
  <footer className='w3-container w3-dark-grey w3-padding-32 w3-margin-top'>
    <p>
      Powered by{' '}
      <a href='https://www.w3schools.com/w3css/default.asp' target='_blank'>
        w3.css
      </a>
    </p>
  </footer>
)

const AboutCard = () => (
  <div className='w3-card w3-margin w3-margin-top'>
    <img src='/w3images/avatar_g.jpg' style={w100pct} />
    <div className='w3-container w3-white'>
      <h4>
        <b>Car Lovers</b>
      </h4>
      <p>
        Just me, myself and I, exploring the universe of uknownment. I have a
        heart of love and a interest of lorem ipsum and mauris neque quam blog.
        I want to share my world with you.
      </p>
    </div>
  </div>
)

const PopularPosts = () => (
  <div className='w3-card w3-margin'>
    <div className='w3-container w3-padding'>
      <h4>Popular Posts</h4>
    </div>
    <ul className='w3-ul w3-hoverable w3-white'>
      <li className='w3-padding-16'>
        <img
          src='/w3images/workshop.jpg'
          alt='Image'
          className='w3-left w3-margin-right'
        />
        <span className='w3-large'>Lorem</span>
        <br />
        <span>Sed mattis nunc</span>
      </li>
      <li className='w3-padding-16'>
        <img
          src='/w3images/gondol.jpg'
          alt='Image'
          className='w3-left w3-margin-right'
          style={w50px}
        />
        <span className='w3-large'>Ipsum</span>
        <br />
        <span>Praes tinci sed</span>
      </li>
      <li className='w3-padding-16'>
        <img
          src='/w3images/skies.jpg'
          alt='Image'
          className='w3-left w3-margin-right'
          style={w50px}
        />
        <span className='w3-large'>Dorum</span>
        <br />
        <span>Ultricies congue</span>
      </li>
      <li className='w3-padding-16 w3-hide-medium w3-hide-small'>
        <img
          src='/w3images/rock.jpg'
          alt='Image'
          className='w3-left w3-margin-right'
          style={w50px}
        />
        <span className='w3-large'>Mingsum</span>
        <br />
        <span>Lorem ipsum dipsum</span>
      </li>
    </ul>
  </div>
)

class Blogs extends Component {
  constructor (props) {
    super(props)
    this.state = { items: [] }
  }
  componentDidMount () {
    items()
      .then(data => {
        console.log(data)
        
        const blogs = data.ALL.items.filter(
          item => item.type === 'Maximum_Article'
        )
        const items = data.items // CHANGE CODE to return the full items
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
    maximum_article_category,
    maximum_article_content,
    maximum_article_image_280x210,
    maximum_article_image_1000x562,
    maximum_article_date
  } = fields
  const content = { __html: maximum_article_content } // to be used with dangerouslySetInnerHTML
  const image = toHref(maximum_article_image_1000x562)
  const date = dateToMDY(item.updatedDate)

  return (
    <div className='w3-card-4 w3-margin w3-white'>
      <img src={image} alt={item.name} style={w100pct} />
      <div className='w3-container'>
        <h3>
          <b>{maximum_article_category}</b>
        </h3>
        <h5>
          {item.description}, <span className='w3-opacity'>{date}</span>
        </h5>
      </div>

      <div className='w3-container'>
        <p dangerouslySetInnerHTML={content} />
        <div className='w3-row'>
          <div className='w3-col m8 s12'>
            <p>
              <button className='w3-button w3-padding-large w3-white w3-border'>
                <b>READ MORE »</b>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
