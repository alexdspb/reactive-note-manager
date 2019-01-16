import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";
import "./css/note.css";
import EditableLabel from "react-inline-editing";
import { DragSource, DropTarget } from "react-dnd";
import flow from "lodash/flow";

class Note extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleFocusOut = this.handleFocusOut.bind(this);
    }

    handleFocusOut = text => {
        const note = this.props.note;
        note.title = text;
        this.props.onNoteRename(note);
    };

    handleClick = () => {
        this.props.onSelectNote(this.props.note);
    };

    render() {
        const {
            note,
            isDragging,
            connectDragSource,
            connectDropTarget
        } = this.props;

        var noteClass = `notice ${note.active ? "notice-active" : ""}`;
        const opacity = isDragging ? 0 : 1;
        return connectDragSource(
            connectDropTarget(
                <div className={noteClass} style={{ opacity: { opacity } }}>
                    <Glyphicon
                        className={"notice-icon"}
                        glyph="file"
                        style={{ height: "50px" }}
                        onClick={this.handleClick}
                    />
                    <div className={"notice-title"}>
                        <EditableLabel
                            text={note.title}
                            labelClassName="myLabelClass"
                            inputClassName="myInputClass"
                            inputWidth="75px"
                            inputHeight="25px"
                            labelFontWeight="normal"
                            inputFontWeight="bold"
                            onFocusOut={this.handleFocusOut}
                        />
                    </div>
                </div>
            )
        );
    }
}

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            note: props.note
        };
    }
};

const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        props.moveCard(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
};

export default flow(
    DropTarget("CARD", cardTarget, connect => ({
        connectDropTarget: connect.dropTarget()
    })),
    DragSource("CARD", cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }))
)(Note);