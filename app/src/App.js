import "./App.css";
import "./fufu.css";

import FufuTable from "./table";

const columns = [
  { name: "ID", title: "ID" },
  { name: "first_name", title: "First Name", textAlign: "left" },
  { name: "last_name", title: "Last Name", textAlign: "left" },
  { name: "email", title: "Email" },
  { name: "created", title: "Joined" },
  { name: "permissions", title: "Permissions" },
];

const data = [...Array(100).keys()].map((_e, index) => {
  return {
    ID: index + 1,
    first_name: `Name ${index + 1}`,
    last_name: `Name2 ${index + 1}`,
    email: `Name${index}.Name2${index + 1}@yahoo.google`,
    created: new Date(),
    permissions: [...Array(10).keys()].map((__e, permissionIndex) => {
      return {
        name: `permission_${permissionIndex + 1}`,
        title: `Permission ${permissionIndex + 1}`,
      };
    }),
  };
});

function App() {
  return (
    <div className="App">
      <FufuTable
        columns={columns}
        data={data}
        title="Fufu Table"
        index
        defaultSortColumn="first_name"
        defaultSortOrder="desc"
        // celled
        defaultPadding="large"
        hover
      />
    </div>
  );
}

export default App;
