import React from 'react'
import Meta from '../../components/layout/meta'
import NotFound from '../notfound'
import { Client, linkResolver } from '../../components/prismic'
import { RichText } from 'prismic-reactjs'

const graphQuery = `{
  blog_post {
    ...blog_postFields
    author {
      name
      bio
      picture
    }
  }
}`

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { computedMatch: { params } } = this.props;
    Client.getByUID('blog_post', params.uid, { graphQuery })
    .then(blogpost => this.setState({ blogpost }))
    .catch(error => {
      console.error(error)
      this.setState({ error })
    })
  }

  componentDidUpdate() {
    if(this.state.blogpost) window.prerenderReady = true
  }

  renderBody() {
    return (
      <React.Fragment>
        <div className="l-wrapper">
          <hr className="separator-hr" />
        </div>

        <article className="blog-post-article">
          <div className="blog-post-inner">
            <div className="blog-post-image-wrapper">
              <img className="blog-post-image" src={this.state.blogpost.data.image.url} alt={this.state.blogpost.data.image.alt}/>
            </div>
            <div className="blog-post-title">
              {RichText.render(this.state.blogpost.data.title, linkResolver)}
            </div>
            <div className="blog-post-rich-content">
              {RichText.render(this.state.blogpost.data.rich_content, linkResolver)}
            </div>
            <div className="blog-post-author-wrapper">
              {this.state.blogpost.data.author.data && this.state.blogpost.data.author.data.picture
                ? <img className="blog-post-author-picture" src={this.state.blogpost.data.author.data.picture.url} alt={this.state.blogpost.data.author.data.picture.alt} />
                : ''
              }
              <div>
                {this.state.blogpost.data.author.data && this.state.blogpost.data.author.data.name
                  ? <p className="blog-post-author-name">{RichText.asText(this.state.blogpost.data.author.data.name)}</p>
                  : ''
                }
                {this.state.blogpost.data.author.data && this.state.blogpost.data.author.data.bio
                  ? <p className="blog-post-author-bio">{RichText.asText(this.state.blogpost.data.author.data.bio)}</p>
                  : ''
                }
              </div>
            </div>
          </div>
        </article>

        <div data-wio-id={document.id}></div>
      </React.Fragment>
    )
  }

  render() {
    if(this.state.error) return <NotFound msg="this article doesn't exists." />
    else if(!this.state.blogpost) return ''

    return (
    <React.Fragment>
      {Meta(this.state.blogpost)}
      {this.renderBody()}
    </React.Fragment>
    )
  }
}