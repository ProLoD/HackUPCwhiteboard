// Main dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import svg, {Container as draw} from 'svg.js'

export default class WhiteboardSVG extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paths: [],
            currentPath: [],
            isDrawing: false,
            top: 0,
            left: 0
        };
        this.handleDrawStart = this.handleDrawStart.bind(this);
        this.handleDrawEnd = this.handleDrawEnd.bind(this);
        this.handleDrawMove = this.handleDrawMove.bind(this);
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.refs.canvas);
        const rect = node.getBoundingClientRect();
        const { left, top } = rect;
        this.setState({ top, left });
    }

    handleDrawStart(e) {
        e.preventDefault();
        if (this.props.tool === 'text') {
            console.log("text");
        }
        else if (this.props.tool === 'eraser') {
            console.log("eraser");
        }
        else {
            console.log("draw")
            this.setState((prevState) => {
                if (!prevState.isDrawing) {
                    return {
                        isDrawing: true,
                        activePath: []
                    }
                }
            });
        }
    };

    handleDrawMove(e) {
        if (this.props.tool === 'text') {
            console.log("drawing texbox size");


        }
        else if (this.props.tool === 'eraser') {
            console.log("erasing");
        }
        else {
            console.log("drawing")
            const pageX = e.pageX;
            const pageY = e.pageY;
            this.setState((prevState) => {
                if (prevState.isDrawing) {
                    const x = pageX - prevState.left;
                    const y = pageY - prevState.top;
                    const activePath = prevState.activePath.concat({x, y});
                    return {activePath};
                }
            });
        }
    };

    handleDrawEnd() {
        this.setState((prevState, prevProps) => {
            if (prevState.isDrawing) {
                const path = WhiteboardSVG.parsePoints(prevState.activePath, prevProps.color);
                if (path) {
                    return {
                        isDrawing: false,
                        activePath: [],
                        paths: prevState.paths.concat(path)
                    };
                }
                return {
                    isDrawing: false,
                    activePath: []
                };
            }
        });
    };

    static parsePoints(points, color) {
        let path;
        if (points && points.length > 0) {
            path = `M ${points[0].x} ${points[0].y}`;
            let p1, p2, end;
            for (let i = 1; i < points.length - 2; i += 2) {
                p1 = points[i];
                p2 = points[i + 1];
                end = points[i + 2];
                path += ` C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`;
            }
            return (<path
                key={path}
                stroke={color}
                strokeWidth={10}
                d={path}
                fill="none"
            />);
        }
    }

    render() {
        return (
            <div>
                <svg
                    style={{ border: '1px solid black', cursor: 'crosshair' }}
                    width={600}
                    height={480}
                    ref="canvas"
                    onMouseDown={this.handleDrawStart}
                    onTouchStart={this.handleDrawStart}
                    onMouseUp={this.handleDrawEnd}
                    onTouchEnd={this.handleDrawEnd}
                    onMouseMove={this.handleDrawMove}
                    onTouchMove={this.handleDrawMove}
                >
                    {[this.state.paths]}
                    {WhiteboardSVG.parsePoints(this.state.activePath, this.props.color)}
                    {[this.state.texts]}
                </svg>
            </div>
        );
    }
}