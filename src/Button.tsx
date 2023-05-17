import { PropsWithChildren } from "react";

type ButtonProps = {
  onClick?: () => void;
  bgColor: string;
  textColor: string;
  border?: string;
  disabled?: boolean;
  additionalStyle?: string;
};

const Button = ({
  onClick,
  bgColor,
  textColor,
  border,
  additionalStyle,
  disabled,
  children,
}: ButtonProps & PropsWithChildren) => {
  return disabled ? (
    <div
      onClick={onClick}
      className={`${additionalStyle} cursor-not-allowed w-fit h-fit p-2 px-4 border-gray-outline border-2 text-gray-onBg bg-gray-bg font-semibold rounded-lg`}
    >
      {children}
    </div>
  ) : (
    <div
      onClick={onClick}
      className={`${additionalStyle} cursor-pointer w-fit h-fit p-2 px-4 ${border} ${bgColor} ${textColor} font-semibold rounded-lg`}
    >
      {children}
    </div>
  );
};

type SubButtonProps = {
  onClick?: () => void;
  additionalStyle?: string;
  disabled?: boolean;
} & PropsWithChildren;

Button.Primary = ({
  onClick,
  additionalStyle,
  disabled,
  children,
}: SubButtonProps) => (
  <Button
    disabled={disabled}
    onClick={onClick}
    additionalStyle={additionalStyle}
    border="border-primary-bg border-2 hover:border-primary-onBg"
    bgColor="bg-primary-bg hover:bg-primary-onBg"
    textColor="text-white"
  >
    {children}
  </Button>
);

Button.Secondary = ({
  onClick,
  additionalStyle,
  disabled,
  children,
}: SubButtonProps) => (
  <Button
    disabled={disabled}
    onClick={onClick}
    additionalStyle={additionalStyle}
    border="border-secondary-bg border-2"
    bgColor="bg-white hover:bg-secondary-bg"
    textColor="text-secondary-bg hover:text-white"
  >
    {children}
  </Button>
);

Button.Cancel = ({
  onClick,
  additionalStyle,
  disabled,
  children,
}: SubButtonProps) => (
  <Button
    disabled={disabled}
    onClick={onClick}
    additionalStyle={additionalStyle}
    border="border-error-bg border-2"
    bgColor="bg-white hover:bg-error-bg"
    textColor="text-error-bg hover:text-white"
  >
    {children}
  </Button>
);

// Button.Submit = ({onClick, additionalStyle, disabled, children}: SubButtonProps) =>
//     <Button
//         disabled={disabled}
//         onClick={this != undefined ? this.form.submit : onClick}
//         additionalStyle={additionalStyle}
//         border="border-primary-bg border-2 hover:border-primary-onBg"
//         bgColor="bg-primary-bg hover:bg-primary-onBg"
//         textColor="text-white"
//     >
//         {children}
//     </Button>;

export default Button;
