import { Account, CoList, CoMap, Profile, co } from 'jazz-tools';

export class Task extends CoMap {
  done = co.boolean;
  text = co.string;
}

export class ListOfTasks extends CoList.Of(co.ref(Task)) {}

export class TodoProject extends CoMap {
  title = co.string;
  tasks = co.ref(ListOfTasks);
}

export class ListOfProjects extends CoList.Of(co.ref(TodoProject)) {}

export class TodoAccountRoot extends CoMap {
  projects = co.ref(ListOfProjects);
}

export class TodoAccount extends Account {
  profile = co.ref(Profile);
  root = co.ref(TodoAccountRoot);

  migrate() {
    if (!this._refs.root) {
      this.root = TodoAccountRoot.create(
        { projects: ListOfProjects.create([], { owner: this }) },
        { owner: this }
      );
    }
  }
}
