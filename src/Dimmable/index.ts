import {IDimmableProps} from './index';
import {Component, Children, cloneElement} from 'react';
import {h, noop} from '../util';
import {Dimmer, IDimmerProps} from '../Dimmer';

export interface IDimmableProps extends IDimmerProps {
  dim?: boolean;
  blur?: number;
  renderOverlay?: (dim?: boolean) => React.ReactChild;
}

export class Dimmable extends Component<IDimmableProps> {
  static defaultProps = {
    blur: 5,
  };

  render () {
    const {children, dim, blur, renderOverlay, ...rest} = this.props;
    const element = Children.only(children);
    const elementChildren = Children.toArray(element.props.children);
    let child: React.ReactChild;
    const dimmerProps: IDimmerProps = rest;

    dimmerProps.hidden = !dim;

    let childProps = null;

    if (dim) {
      childProps = {
        style: {
          pointerEvents: 'none'
        }
      };

      if (blur) {
        childProps.style = {
          filter: `blur(${blur}px)`
        };
      }
    }

    if ((elementChildren.length === 1) && (typeof elementChildren[0] === 'object')) {
      child = elementChildren[0] as React.ReactElement<any>;

      if (childProps) {
        if (child.props.style) {
          childProps.style = {
            ...child.props.style,
            ...childProps.style
          };

          if (childProps.style.filter && child.props.style.filter) {
            childProps.style.filter += ' ' + child.props.style.filter;
          }
        }

        child = cloneElement(child, childProps);
      }
    } else {
      child = h('div', childProps, ...elementChildren);
    }

    return cloneElement(element, {},
      child,
      h(Dimmer, rest, (renderOverlay || noop)(dim)),
    );
  }
}
