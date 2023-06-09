import React, { useRef } from "react";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/ListGroup";
import { Issue } from "../Issue/Issue";

import { useDrag, useDrop } from "react-dnd";

import { useDispatch, useSelector } from "react-redux";
import { getToDoIssues } from "../../redux/toDoIssues/slice";
import { getInProgressIssues } from "../../redux/inProgressIssues/slice";
import { getDoneIssues } from "../../redux/doneIssues/slice";
import { toDoIssuesValue } from "../../redux/toDoIssues/selectors";
import { inProgressIssuesValue } from "../../redux/inProgressIssues/selectors";
import { doneIssuesValue } from "../../redux/doneIssues/selectors";
import { COLUMN_NAMES } from "../../constants/constants";
import { addChange } from "../../redux/changes/slice";
import { repoValue } from "../../redux/repo/selectors";

export const Movable = ({ issue, title }) => {
  const dispatch = useDispatch();

  const url = useSelector(repoValue);
  const repo = url.split("github.com/")[1];

  const toDoIssues = useSelector(toDoIssuesValue);
  const inProgressIssues = useSelector(inProgressIssuesValue);
  const doneIssues = useSelector(doneIssuesValue);

  function objChange(columnIn, columnOut, id, issue) {
    return {
      repo: repo,
      id: id,
      columnIn: columnIn,
      columnOut: columnOut,
      issue: issue,
    };
  }

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "Movable",
    drop: () => ({ name: title }),
  });

  const [{ isDragging }, drag] = useDrag({
    item: { name: title },
    type: "Movable",
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult(item);

      if (
        dropResult &&
        Object.values(COLUMN_NAMES).includes(dropResult.name) &&
        dropResult.name !== title
      ) {
        switch (title) {
          case "ToDo":
            dispatch(
              getToDoIssues(
                toDoIssues.filter((element) => element.id !== issue.id)
              )
            );
            dispatch(
              addChange(objChange(dropResult.name, title, issue.id, issue))
            );
            break;

          case "In Progress":
            dispatch(
              getInProgressIssues(
                inProgressIssues.filter((element) => element.id !== issue.id)
              )
            );
            dispatch(
              addChange(objChange(dropResult.name, title, issue.id, issue))
            );
            break;

          case "Done":
            dispatch(
              getDoneIssues(
                doneIssues.filter((element) => element.id !== issue.id)
              )
            );
            dispatch(
              addChange(objChange(dropResult.name, title, issue.id, issue))
            );
            break;
        }
      }
      if (dropResult && dropResult.name !== title) {
        switch (dropResult.name) {
          case "ToDo":
            dispatch(getToDoIssues([...toDoIssues, issue]));
            break;

          case "In Progress":
            dispatch(getInProgressIssues([...inProgressIssues, issue]));
            break;

          case "Done":
            dispatch(getDoneIssues([...doneIssues, issue]));
            break;
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));

  return (
    <ListGroup.Item
      as="li"
      action
      ref={ref}
      className="movable-item"
      style={{
        opacity,
        padding: "20px 20px 0px 20px",
        background: "transparent",
        border: "none",
      }}
    >
      <Issue issue={issue} />
    </ListGroup.Item>
  );
};

Movable.propTypes = {
  issue: PropTypes.object,
  title: PropTypes.string,
};
