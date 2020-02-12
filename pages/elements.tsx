import React from 'react';

import { Table, THead, TR, TD, TH, TBody, Code } from '@expo/html-elements';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

const Examples = [
  {
    key: 'anchor-link',
    title: 'Link to website',
    html: `<a href="#">Link</a>`,
    expo: `
import { A } from '@expo/html-elements';
<A href="#">Link</a>
`,
  },
];

export default function({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>React Native Cheat Sheet</PageHeader>
      {Examples.map((example: any) => (
        <ExampleCard key={example.key} {...example} />
      ))}
    </Layout>
  );
}

function TableCell({ title, children }) {
  return (
    <TR>
      <TH colSpan={1} style={{ paddingHorizontal: 16, alignSelf: 'center' }}>
        {title}
      </TH>
      <TD>
        <pre>
          <Code style={{ padding: 16 }}>{children}</Code>
        </pre>
      </TD>
    </TR>
  );
}

function ExampleCard({ title, html, expo }: any) {
  return (
    <Table
      style={{
        shadowColor: 'black',
        shadowOpacity: 0.2,
        backgroundColor: 'white',
        shadowRadius: 3,
      }}
    >
      <THead style={{ backgroundColor: '#f8f9fa' }}>
        <TR>
          <TH colSpan="2" style={{ color: '#667788' }}>
            Link
          </TH>
        </TR>
      </THead>
      <TBody style={{}}>
        <TableCell title="HTML">{html}</TableCell>
        <TableCell title="Expo">{expo}</TableCell>
      </TBody>
    </Table>
  );
}
