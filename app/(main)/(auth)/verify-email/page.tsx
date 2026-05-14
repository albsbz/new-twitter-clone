import { Suspense } from "react";
import VerifyEmail from "./VerifyEmail";

function page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}

export default page;
