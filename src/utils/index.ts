/*
 * Don't use this method for 'Letter Spacing', 'Box Shadow/Drop shadow' and 'Small Borders'. Use px directly for them.
 * Method to convert px to rem to allow proper scaling of elements
 */
export const rem = (px: number | string) => {
  return typeof px === 'number'
    ? `${px / 16}rem`
    : `${parseInt(px.split('px')[0]) / 16}rem`
}

/*
 * a wrapper created to handle api calling instead of rewriting the code multiple times
 */
export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
}

// wrapper function GET
async function get(url: string) {
  const requestOptions = {
    method: 'GET',
  }
  return fetch(url, requestOptions).then(handleResponse)
}

// wrapper function POST
async function post(url: string, body?: BodyInit) {
  const requestOptions = {
    method: 'POST',
    headers: { accept: '*/*', 'Content-Type': 'application/json' },
    body,
  }
  return fetch(url, requestOptions).then(handleResponse)
}

// wrapper function PUT
async function put(url: string, body?: BodyInit) {
  const requestOptions = {
    method: 'PUT',
    headers: { accept: '*/*', 'Content-Type': 'application/json' },
    body,
  }
  return fetch(url, requestOptions).then(handleResponse)
}

// prefixed with underscored because delete is a reserved word in javascript
// wrapper function DELETE
async function _delete(url: string) {
  const requestOptions = {
    method: 'DELETE',
  }
  return fetch(url, requestOptions).then(handleResponse)
}

// helper function
async function handleResponse(response: Response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}

export function formatNumberSuffix(amount: number) {
  if (amount <= 0) return 0
  if (amount < 1) return toFixed(amount, 4)
  const abbreviations = ['', 'K', 'M', 'B', 'T']
  const abbreviationIndex = Math.floor(Math.log10(amount) / 3)
  return (
    toFixed(amount / Math.pow(10, abbreviationIndex * 3), 1) +
    abbreviations[abbreviationIndex]
  )
}

export function percentge(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue
}

export function toFixed(num: number, digits: number) {
  if (isNaN(num)) {
    return 'NaN'
  }
  if (digits < 0) {
    throw new RangeError('toFixedNoRound() digits argument must be more than 0')
  }
  let str = num.toString()
  let decimalIndex = str.indexOf('.')
  if (decimalIndex === -1) {
    return str + '.' + '0'.repeat(digits)
  } else if (digits === 0) {
    return str.substring(0, decimalIndex)
  } else {
    let numDigitsAfterDecimal = str.length - decimalIndex - 1
    if (numDigitsAfterDecimal === digits) {
      return str
    } else if (numDigitsAfterDecimal < digits) {
      return str + '0'.repeat(digits - numDigitsAfterDecimal)
    } else {
      return str.substring(0, decimalIndex + digits + 1)
    }
  }
}

export * from './constants'
