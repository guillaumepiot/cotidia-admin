import React, { Component} from 'react'
import PropTypes from 'prop-types'

class FileUpload extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    extraData: PropTypes.object,
    id: PropTypes.string.isRequired,
    performSearch: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  state = {
    error: null,
    percent: 0,
    public: false,
    uploading: false,
  }

  constructor (props) {
    super(props)

    const csrfmiddlewaretokenInput = document.querySelector('input[name=csrfmiddlewaretoken]')

    if (csrfmiddlewaretokenInput) {
      this.csrfmiddlewaretoken = csrfmiddlewaretokenInput.value
    }
  }

  handleSelect = async (event) => {
    if (event.target.files.length) {
      const file = event.target.files[0]

      if (file) {
        this.setState({
          uploading: true,
          percent: 0,
          error: null,
        })

        try {
          await this.uploadFile(
            file,
            (percent) => this.setState({ percent })
          )

          this.setState({
            uploading: false,
            percent: 100,
          })

          this.props.performSearch()
        } catch (e) {
          this.setState({
            uploading: false,
            percent: 0,
            error: e,
          })
        }
      }
    }
  }

  async uploadFile (file, onProgress) {
    const { endpoint, extraData } = this.props

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          let message = 'There was an issue uploading the file.'

          // If it's a 400 response, there's probably some JSON error message data.
          if (xhr.status === 400) {
            try {
              var json = JSON.parse(xhr.responseText)
              message = json.f.reduce(
                (acc, item) => `${acc} ${item}`,
                ''
              )
            } catch {
              // Give up if unparseable.
            }
          }

          reject(message)
        }
      }

      xhr.onerror = () => {
        console.error(`Network error while uploading ${file.name}`)

        reject('There was an issue uploading the file.')
      }

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      }

      var data = new FormData()
      data.append('csrfmiddlewaretoken', this.csrfmiddlewaretoken)

      data.append('f', file)

      if (extraData) {
        for (const [key, value] of Object.entries(extraData)) {
          data.append(key, value)
        }
      }

      xhr.open('POST', endpoint)
      xhr.send(data)
    })
  }

  render () {
    const { value } = this.props
    const { error, percent, uploading } = this.state

    const id = `file-${this.props.id}`

    return (
      <div>
        {error && (
          <div className='alert alert--error'>
            {error}
          </div>
        )}

        <input
          id={id}
          onChange={this.handleSelect}
          style={{ display: 'none' }}
          type='file'
        />

        <label htmlFor={id}>
          <span className={`btn btn--small btn--change`}>{value ? 'Replace' : 'Upload'}</span>
        </label>

        {value && (
          <>
           {' '}
            <a href={value} target='_blank' className={`btn btn--small btn--primary`}>
              View
            </a>
          </>
        )}

        {uploading && (
          <div>
            Uploading, {percent}% complete.
          </div>
        )}
      </div>
    )
  }
}

import { connect } from 'react-redux'
import { performSearch } from '../../redux/modules/search/actions'

const actionCreators = { performSearch }

export default connect(null, actionCreators)(FileUpload)
