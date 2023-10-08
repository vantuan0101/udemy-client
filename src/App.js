import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import publicRoutes from "./routes";
const checkChildren = (children, index) => {
  if (children?.children && children?.children.length > 0) {
    return (
      <Route key={index} path={children.path} element={children.element}>
        {children.children.map((child, indx) => {
          if (child.children) {
            return checkChildren(child, indx);
          }
          return <Route key={indx} path={child.path} element={child.element} />;
        })}
      </Route>
    );
  } 
  return (
    <Route key={index} path={children.path} element={children.element} />
  );
};
function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        return checkChildren(route, index);
      })}
    </Routes>
  );
}

export default App;