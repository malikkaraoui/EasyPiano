import Layout from "@components/Layout/Layout";
import AppRouter from "@app/router/AppRouter";
import ConfigBanner from "@components/UI/ConfigBanner";

export default function App() {
  return (
    <Layout>
      <ConfigBanner />
      <AppRouter />
    </Layout>
  );
}
