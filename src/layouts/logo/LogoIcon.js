import React from "react";
import Link  from "next/link";
import Image from "next/image";
import LogoDark from "../../../assets/images/logos/logo.png";

const LogoIcon = () => {
  return (
    <Link href="/">
      <Image src={LogoDark} alt={LogoDark} height="200px" width={"100px"} />
    </Link>
  );
};

export default LogoIcon;
