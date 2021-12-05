export default {
  command: 'test',

  description: 'Feature testing command',

  async handler () {
    $mongoose.connection.close()
  }
}