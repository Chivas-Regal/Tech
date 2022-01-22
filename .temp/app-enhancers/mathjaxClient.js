
          import '/Users/snopzyz/Documents/GitHub/test/.temp/plugins-mathjax.css'
          export default ({Vue, options, router, siteData}) => {
            // Ignore mathjax element
            Vue.config.ignoredElements = [
              /^mjx-/
            ]
          }
        