import PrettyError from 'pretty-error'

export default error => console.log((new PrettyError()).render(error))