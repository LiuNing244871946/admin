const getters = {
  sidebar: state => state.app.sidebar,
  userName: state => window.sessionStorage.getItem('userName'),
  visitedViews: state => state.tagsView.visitedViews
}
export default getters
