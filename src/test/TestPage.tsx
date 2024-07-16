import {
  Image,
  Button,
  Link,
  FormControl,
  Heading,
  AriaHidden,
  Layout,
  LiveRegion,
  Table,
} from "./categories";

export const TestPage = () => (
  <main className="p-3">
    <h1 className="text-2xl font-bold">
      The Test Page of Accessibility Visualizer
    </h1>
    <p className="mt-3 max-w-4xl">
      This page serves as a testing ground for the Accessibility Visualizer. It
      contains numerous examples of less accessible elements for demonstration
      and testing purposes.
    </p>
    <Image />
    <Button />
    <Link />
    <FormControl />
    <Heading />
    <Table />
    <AriaHidden />
    <Layout />
    <LiveRegion />
  </main>
);
