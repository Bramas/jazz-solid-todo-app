import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAccount } from "../jazz-solid";
import { Group } from "jazz-tools";
import { TodoProject, ListOfTasks, TodoAccount } from "./schema";

const NewProjectForm: Component = () => {
  const { me } = useAccount<TodoAccount>();
  const navigate = useNavigate();
  const [title, setTitle] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const t = title().trim();
    const account = me();
    if (!account || !t) return;
    const projectGroup = Group.create({ owner: account });
    const project = TodoProject.create(
      {
        title: t,
        tasks: ListOfTasks.create([], { owner: projectGroup }),
      },
      { owner: projectGroup }
    );
    account.root?.projects?.push(project);
    navigate(`/project/${project.id}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ 'display': 'flex', 'gap': '0.5rem', 'margin-top': '1rem' }}>
      <input
        type="text"
        value={title()}
        onInput={(e) => setTitle(e.currentTarget.value)}
        placeholder="New project title"
        style={{ 'flex': '1', 'padding': '0.5rem', 'border': '1px solid #d1d5db', 'border-radius': '4px' }}
      />
      <button
        type="submit"
        style={{ 'padding': '0.5rem 1rem', 'background': '#000', 'color': '#fff', 'border': 'none', 'border-radius': '4px', 'cursor': 'pointer' }}
      >
        Create
      </button>
    </form>
  );
};

export default NewProjectForm;
