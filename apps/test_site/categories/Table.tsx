import { CategoryTitle, ExampleList } from "../components";

export const Table = () => (
  <>
    <CategoryTitle>Tables</CategoryTitle>
    <ExampleList
      examples={[
        {
          title: "Table with header and footer",
          body: (
            <table className="table-auto border-2">
              <caption>Table with header and footer</caption>
              <thead>
                <tr>
                  <th className="p-2 border-2">0-0</th>
                  <th className="p-2 border-2">0-1</th>
                  <th className="p-2 border-2">0-2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-2">1-0</td>
                  <td className="p-2 border-2">1-1</td>
                  <td className="p-2 border-2">1-2</td>
                </tr>
                <tr>
                  <td className="p-2 border-2">2-0</td>
                  <td className="p-2 border-2">2-1</td>
                  <td className="p-2 border-2">2-2</td>
                </tr>
                <tr>
                  <td className="p-2 border-2">3-0</td>
                  <td className="p-2 border-2">3-1</td>
                  <td className="p-2 border-2">3-2</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="p-2 border-2">4-0</td>
                  <td className="p-2 border-2">4-1</td>
                  <td className="p-2 border-2">4-2</td>
                </tr>
              </tfoot>
            </table>
          ),
        },
        {
          title: "Wrong tfoot position",
          body: (
            <table className="table-auto border-2 intentional-violation">
              <caption>Wrong tfoot position table</caption>
              <thead>
                <tr>
                  <th className="p-2 border-2">0-0</th>
                  <th className="p-2 border-2">0-1</th>
                  <th className="p-2 border-2">0-2</th>
                </tr>
              </thead>
              <tfoot className="intentional-violation">
                <tr>
                  <td className="p-2 border-2">4-0</td>
                  <td className="p-2 border-2">4-1</td>
                  <td className="p-2 border-2">4-2</td>
                </tr>
              </tfoot>
              <tbody className="intentional-violation">
                <tr>
                  <td className="p-2 border-2">1-0</td>
                  <td className="p-2 border-2">1-1</td>
                  <td className="p-2 border-2">1-2</td>
                </tr>
                <tr>
                  <td className="p-2 border-2">2-0</td>
                  <td className="p-2 border-2">2-1</td>
                  <td className="p-2 border-2">2-2</td>
                </tr>
                <tr>
                  <td className="p-2 border-2">3-0</td>
                  <td className="p-2 border-2">3-1</td>
                  <td className="p-2 border-2">3-2</td>
                </tr>
              </tbody>
            </table>
          ),
        },
      ]}
    />
  </>
);
