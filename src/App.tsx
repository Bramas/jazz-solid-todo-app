import { Component, useContext, createEffect, Show, For } from "solid-js";
import { Router, Route, useNavigate, useParams } from "@solidjs/router";
import {
  PassphraseAuthBasicUI,
  useAccount,
  useAcceptInvite,
  useCoState,
  PasskeyAuthBasicUI,
} from "../jazz-solid";
import { TodoAccount, TodoProject } from "./schema";
import NewProjectForm from "./NewProjectForm";
import ProjectTodoTable from "./ProjectTodoTable";


const HomeScreen: Component = () => {
  const { me, logOut } = useAccount<TodoAccount>({
    resolve: { root: { projects: { $each: true } } },
  });
  const navigate = useNavigate();

  return (
    <Show when={me()?.root} fallback={<div>Loading ...</div>}>
      {(root) => (
        <div
          style={{ "max-width": "600px", margin: "2rem auto", padding: "1rem" }}
        >
          <div style={{ "text-align": "right", "margin-bottom": "1rem" }}>
            <button
              onClick={() => logOut()}
              style={{
                padding: "0.5rem 1rem",
                background: "#f5f5f5",
                border: "1px solid #ccc",
                "border-radius": "4px",
                cursor: "pointer",
              }}
            >
              Log out
            </button>
          </div>
          <Show when={root()?.projects?.length}>
            <h1 style={{ "font-size": "1.5rem", "margin-bottom": "1rem" }}>
              My Projects
            </h1>
            <ul
              style={{
                "list-style": "none",
                padding: "0",
                margin: "0",
                display: "flex",
                "flex-direction": "column",
                gap: "0.5rem",
              }}
            >
              <For each={root()?.projects}>
                {(project) => (
                  <li>
                    <button
                      onClick={() => navigate(`/project/${project.id}`)}
                      style={{
                        width: "100%",
                        "text-align": "left",
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        "border-radius": "4px",
                        cursor: "pointer",
                      }}
                    >
                      {project.title}
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </Show>
          <NewProjectForm />
        </div>
      )}
    </Show>
  );
};

const App: Component = () => {
  return (
    <Router root={(props) => {
      const navigate = useNavigate();

      useAcceptInvite({
        invitedObjectSchema: TodoProject,
        forValueHint: "project",
        onAccept: (projectID) => navigate("/project/" + projectID),
      });

      return props.children;
    }}>
      <Route path="/" component={HomeScreen} />
      <Route path="/project/:projectId" component={ProjectTodoTable} />
    </Router>
  );
};
   

export default App;
