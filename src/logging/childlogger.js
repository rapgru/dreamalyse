import { remote } from 'electron';

export default function (name) {
  return remote.getGlobal('mainLogger').child({ thread: name });
}
