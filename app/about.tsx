import Layout from "@/app/layout"
import Main from "../components/home/main"
export default async function About(){
  return (
      <Main />
  )
}

About.getLayout = function getLayout(page:any) {
  return <Layout>{page}</Layout>
}