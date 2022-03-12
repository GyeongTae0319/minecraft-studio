export const useLayout = () => {
  return useState("layout", () => ({
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
    bodyScrollLock: false,
    bodyScrollTop: -1,
    bodyScrollbarWidth: 0,
  }));
};
