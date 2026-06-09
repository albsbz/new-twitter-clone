import { Suspense } from "react";
import ResetPassword from "./ResetPassword";

function page() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}

export default page;
