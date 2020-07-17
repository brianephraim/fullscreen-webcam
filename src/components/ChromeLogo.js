import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"


const ChromeLogo = () => {
  const data = useStaticQuery(graphql`
    query chrome {
      chrome: file(relativePath: { eq: "chrome.png" }) {
        childImageSharp {
          fluid(maxWidth: 60) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  console.log('data',data);
  return <Img fluid={data.chrome.childImageSharp.fluid} />
}

export default ChromeLogo;
