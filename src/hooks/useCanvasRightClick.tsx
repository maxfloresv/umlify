import { useState } from "react";

const useClick = () => {
  /** Whether the user has right-clicked the canvas. */
  const [rightClicked, setRightClicked] = useState<boolean>(false);

  /** The (x, y) point in the canvas where the user right-clicked.  */
  interface Point {
    x: number;
    y: number;
  };

  const [mouseCoordinate, setMouseCoordinate] = useState<Point>({
    x: 0,
    y: 0,
  });

  return {
    rightClicked,
    setRightClicked,
    mouseCoordinate,
    setMouseCoordinate
  };
}

export default useClick;