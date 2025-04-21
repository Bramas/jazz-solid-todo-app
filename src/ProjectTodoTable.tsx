import { Component, For, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import type { ID } from "jazz-tools";
import { useCoState } from "../jazz-solid";
import { TodoProject, Task } from "./schema";
import { InviteButton } from "./InviteButton";

const ProjectTodoTable: Component = () => {
  const params = useParams<{ projectId: ID<TodoProject> }>();

  const project = useCoState(TodoProject, params.projectId, {
    resolve: { title: true, tasks: { $each: true } },
  });

  const [newText, setNewText] = createSignal("");

  const addTask = (e: Event) => {
    e.preventDefault();
    const text = newText().trim();
    const p = project();
    if (!p?.tasks || !text) return;
    const task = Task.create({ text, done: false }, { owner: p._owner });
    p.tasks.push(task);
    setNewText("");
  };

  const toggleDone = (task: Task) => {
    task.done = !task.done;
  };

  return (
    <div style={{ "max-width": "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ "text-align": "center", "margin-bottom": "1rem" }}>
        {project()?.title} <small>({project()?.id})</small>
        <InviteButton value={project()} valueHint="project" />
      </h2>
      <div style={{ width: "100%", "overflow-x": "auto" }}>
        <table
          style={{
            width: "100%",
            "border-collapse": "collapse",
            "font-size": "0.875rem",
          }}
        >
          <thead
            style={{
              "border-bottom": "2px solid #eee",
              "background-color": "#f9f9f9",
            }}
          >
            <tr>
              <th style={{ "text-align": "left", padding: "0.75rem" }}>Done</th>
              <th style={{ "text-align": "left", padding: "0.75rem" }}>Task</th>
            </tr>
          </thead>
          <tbody>
            <For each={project()?.tasks}>
              {(t: Task) => (
                <tr style={{ "border-bottom": "1px solid #eee" }}>
                  <td
                    style={{ padding: "0.75rem", "vertical-align": "middle" }}
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      onchange={() => toggleDone(t)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      "vertical-align": "middle",
                      color: t.done ? "#888" : "#000",
                      "text-decoration": t.done ? "line-through" : "none",
                    }}
                  >
                    {t.text}
                  </td>
                </tr>
              )}
            </For>
            <tr style={{ "border-bottom": "1px solid transparent" }}>
              <td style={{ padding: "0.75rem" }} />
              <td style={{ padding: "0.75rem" }}>
                <form
                  onSubmit={addTask}
                  style={{ display: "flex", gap: "0.5rem" }}
                >
                  <input
                    type="text"
                    placeholder="New task"
                    value={newText()}
                    onInput={(e) => setNewText(e.currentTarget.value)}
                    style={{
                      flex: "1",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      "border-radius": "4px",
                    }}
                  />
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTodoTable;
