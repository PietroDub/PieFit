export type FieldIssue = {
  path: string;
  message: string;
};

export function invalidRequest(issues?: FieldIssue[]) {
  if (issues === undefined || issues.length === 0) {
    return { message: "Invalid request" };
  }

  return {
    message: "Invalid request",
    issues,
  };
}
