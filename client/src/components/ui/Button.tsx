import { cva } from "class-variance-authority";

interface ButtonProps {}

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
);

const Button = (props: ButtonProps) => {
  return <div>Button</div>;
};

export default Button;
