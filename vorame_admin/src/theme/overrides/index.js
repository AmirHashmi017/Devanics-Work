import Typography from "./Typography";
import Input from "./Input";
import Link from "./Link";
export default function ComponentsOverrides(theme) {
  return Object.assign(Typography(theme), Input(theme), Link(theme));
}
