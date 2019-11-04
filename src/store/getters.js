const getters = {
  sidebar: state => state.app.sidebar,
  userName: state => window.sessionStorage.getItem('userName')
}
export default getters
