import { Node, InternalNode, Position } from '@xyflow/react';

/**
 * Defines calculations to compute dynamically the handles to use in a node connection.
 * Extracted from https://reactflow.dev/examples/edges/simple-floating-edges (utils.js).
 * 
 * Adapted by Máximo Flores Valenzuela [https://github.com/maxfloresv].
 */

/** 
 * Contains source (s) and target (t) node coordinates, and the handles' 
 * position to construct the edge between them.
 */
interface EdgeParams {
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  sourcePos: Position,
  targetPos: Position
};

/**
 * Calculates dynamically the handle to use in a node for a connection, based on center distances.
 * Note that it receives two nodes, because an edge can only have two members in its definition.
 * 
 * @param {InternalNode<Node>} nodeA - The node of interest to calculate its handle positioning.
 * @param {InternalNode<Node>} nodeB - The other node related to this connection.
 * 
 * @returns {[number, number, Position]} The handle positioning.
 */
function getParams(nodeA: InternalNode<Node>, nodeB: InternalNode<Node>): [number, number, Position] {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position: Position;
  /**
   * If the horizontal distance between the comparing nodes is bigger than the vertical one, we don't want to
   * use the Top or Bottom handles, because the edge wouldn't have enough space to look properly (and viceversa).
   */
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }

  const [x, y] = getHandleCoordsByPosition(nodeA, position);
  return [x, y, position];
}

/**
 * Calculates the coordinates of a handle based on its position.
 * 
 * @param {InternalNode<Node>} node - The node that have the handle.
 * @param {Position} handlePosition - The position of the handle.
 * 
 * @returns {[number, number]} The coordinates of the handle.
 */
function getHandleCoordsByPosition(node: InternalNode<Node>, handlePosition: Position): [number, number] {
  if (!node.internals.handleBounds
    || !node.internals.handleBounds.source
    || (node.internals.handleBounds.target
      && node.internals.handleBounds.target.length > 0)) {
    throw new InvalidHandleException();
  }

  const handle = node.internals.handleBounds.source.find(
    (h) => h.position === handlePosition,
  );

  if (!handle) {
    throw new InvalidHandleException();
  }

  let offsetX: number = handle.width / 2;
  let offsetY: number = handle.height / 2;

  // This is a detail to make the end marker of an edge visible.
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle.height;
      break;
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
}

/**
 * Computes the center coordinates of a node.
 * 
 * @param {InternalNode<Node>} node The node to be processed.
 * 
 * @returns {{ x: number, y: number }} The center coordinates of the node.
 */
function getNodeCenter(node: InternalNode<Node>): { x: number; y: number } {
  let x: number = node.internals.positionAbsolute.x;
  let y: number = node.internals.positionAbsolute.y;

  if (node.measured.width && node.measured.height) {
    x += node.measured.width / 2;
    y += node.measured.height / 2;
  }

  return { x, y };
}

/**
 * Calculates the positioning of two nodes and handles needed to create an edge.
 *  
 * @param {InternalNode<Node>} source - The source node.
 * @param {InternalNode<Node>} target - The target node.
 * 
 * @returns {EdgeParams} The necessary parameters to create the edge.
 */
export function getEdgeParams(source: InternalNode<Node>, target: InternalNode<Node>): EdgeParams {
  const [sx, sy, sourcePos] = getParams(source, target);
  const [tx, ty, targetPos] = getParams(target, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
