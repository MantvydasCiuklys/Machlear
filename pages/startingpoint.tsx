import Layout from "@/app/layout"
import Main from "../components/home/main"
export default async function StartingPoint(){
  return (
      <Main />
  )
}

StartingPoint.getLayout = function getLayout(page:any) {
  return <Layout>{page}</Layout>
}