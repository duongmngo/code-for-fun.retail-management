# React & Next.js Advanced Knowledge & Interview Guide

## Table of Contents
1. [Component Architecture](#1-component-architecture)
2. [React Hooks Deep Dive](#2-react-hooks-deep-dive)
3. [Virtual DOM & Reconciliation](#3-virtual-dom--reconciliation)
4. [Re-rendering & Performance Optimization](#4-re-rendering--performance-optimization)
5. [State Management](#5-state-management)
6. [Next.js Advanced Concepts](#6-nextjs-advanced-concepts)
7. [Advanced Interview Questions](#7-advanced-interview-questions)

---

## 1. Component Architecture

### 1.1 Class Components

```tsx
class Counter extends React.Component<Props, State> {
  state = { count: 0 };
  
  // Lifecycle methods
  componentDidMount() { /* Side effects */ }
  componentDidUpdate(prevProps, prevState) { /* Compare and update */ }
  componentWillUnmount() { /* Cleanup */ }
  shouldComponentUpdate(nextProps, nextState) { /* Performance optimization */ }
  
  // Error boundaries (ONLY available in class components)
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { /* Log errors */ }
  
  render() {
    return <div>{this.state.count}</div>;
  }
}
```

**Key Characteristics:**
- Access to full lifecycle methods
- **this** binding issues (requires **.bind()** or arrow functions)
- Error Boundaries can only be implemented as class components
- State is always an object, updated via **this.setState()**
- **shouldComponentUpdate** for manual optimization

### 1.2 Function Components

```tsx
const Counter: React.FC<Props> = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);
  
  useEffect(() => {
    // componentDidMount + componentDidUpdate
    return () => { /* componentWillUnmount */ };
  }, [dependencies]);
  
  return <div>{count}</div>;
};
```

**Key Characteristics:**
- Simpler syntax, no **this** binding
- Hooks for state and lifecycle
- Better tree-shaking and minification
- Easier to test and compose

### 1.3 Class vs Function Components Deep Comparison

| Aspect | Class Component | Function Component |
|--------|-----------------|-------------------|
| State | **this.state** object | Multiple **useState** hooks |
| Lifecycle | Explicit methods | **useEffect** with deps |
| Error Boundary | YES Supported | NO Not supported |
| **this** keyword | Required | Not needed |
| Performance | **shouldComponentUpdate** | **React.memo**, **useMemo** |
| Closure Issues | No | Yes (stale closures) |
| Code Size | Larger | Smaller |

### Advanced Interview Question

**Q: Why can't Error Boundaries be implemented as function components?**

**A:** Error Boundaries rely on two lifecycle methods:
- **static getDerivedStateFromError()** - Updates state to show fallback UI
- **componentDidCatch()** - Logs error information

These methods have no Hook equivalents because:
1. They need to catch errors during **rendering**, not in effects
2. **useEffect** runs **after** render, too late to catch render errors
3. React team hasn't found a composable Hook API for this pattern yet

**Workaround:** Use libraries like **react-error-boundary** which wraps a class component.

---

## 2. React Hooks Deep Dive

### 2.1 useRef - Complete Guide

```tsx
// 1. DOM Reference
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  inputRef.current?.focus();
}, []);

// 2. Mutable Value (persists across renders, doesn't trigger re-render)
const renderCount = useRef(0);
useEffect(() => {
  renderCount.current += 1;
});

// 3. Previous Value Pattern
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// 4. Callback Ref (for dynamic refs)
const [node, setNode] = useState<HTMLDivElement | null>(null);
const measuredRef = useCallback((node: HTMLDivElement | null) => {
  if (node !== null) {
    setNode(node);
  }
}, []);
```

### useRef Interview Questions

**Q1: What's the difference between useRef and useState?**

| Aspect | useRef | useState |
|--------|--------|----------|
| Re-render on change | NO | YES |
| Persists across renders | YES | YES |
| Mutable | YES (ref.current = x) | NO (immutable) |
| Sync vs Async | Synchronous | Asynchronous (batched) |

**Q2: Why does this code not work as expected?**

```tsx
function Timer() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Always uses stale count (0)
    }, 1000);
    return () => clearInterval(id);
  }, []); // Empty deps - closure captures initial count
  
  return <div>{count}</div>;
}
```

**A:** This is a **stale closure** problem.

### What is a Stale Closure?

A **stale closure** occurs when a function "captures" a variable from its outer scope, but that variable's value becomes outdated (stale) because the closure continues to reference the old value even after the outer scope has updated.

**How JavaScript Closures Work:**
```tsx
function createCounter() {
  let count = 0;
  return function increment() {
    count += 1; // Closure "closes over" the count variable
    return count;
  };
}
```

**Why Stale Closures Happen in React:**

```tsx
function Timer() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // This callback is created ONCE when count = 0
    // It "closes over" the count variable with value 0
    const id = setInterval(() => {
      console.log(count); // Always logs 0!
      setCount(count + 1); // Always sets to 0 + 1 = 1
    }, 1000);
    return () => clearInterval(id);
  }, []); // Empty deps = effect runs once, closure captures initial values
  
  return <div>{count}</div>; // Shows 1, 1, 1, 1...
}
```

**Timeline:**
```
Render 1: count = 0
  - useEffect runs, creates interval
    - Callback captures count = 0 in closure
     
Render 2: count = 1 (after first setCount)
  - useEffect does NOT run (empty deps)
    - Old callback still has count = 0
     
Render 3, 4, 5...: count stays at 1
  - Callback keeps using stale count = 0
```

**Solutions:**

```tsx
// Solution 1: Functional update (RECOMMENDED)
// React passes the CURRENT state value to the updater function
setCount(prev => prev + 1);
// prev is always the latest value, not captured in closure

// Solution 2: useRef to track latest value
// Refs are mutable and don't trigger re-renders
const countRef = useRef(count);
countRef.current = count; // Always sync ref with latest count

useEffect(() => {
  const id = setInterval(() => {
    // countRef.current always has the latest value
    setCount(countRef.current + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);

// Solution 3: Include dependency (creates new interval each time)
// NOT ideal for timers - causes interval reset on each tick
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id); // YES! Called every time count changes
}, [count]); // Re-runs effect every time count changes

/*
  useEffect Cleanup Execution Order:
  
  Render 1 (count = 0):
    1. Effect runs - creates interval #1
                                                             
  Render 2 (count = 1):
    1. Cleanup runs - clearInterval(#1) - CLEANUP FIRST!
    2. Effect runs - creates interval #2
                                                             
  Render 3 (count = 2):
    1. Cleanup runs - clearInterval(#2)
    2. Effect runs - creates interval #3
                                                             
  Component Unmounts:
    1. Cleanup runs - clearInterval(#3)
  
  Why this is NOT ideal for timers:
  - Every second: cleanup old interval + create new interval
  - Wastes resources with constant setup/teardown
  - Timer drift can occur
  - Use functional update (Solution 1) instead!
*/

// Solution 4: useReducer (dispatch is stable)
const [count, dispatch] = useReducer((state, action) => state + 1, 0);

useEffect(() => {
  const id = setInterval(() => {
    dispatch(); // dispatch reference never changes
  }, 1000);
  return () => clearInterval(id);
}, []);
```

**Common Stale Closure Scenarios:**

| Scenario | Cause | Solution |
|----------|-------|----------|
| setInterval/setTimeout | Callback captures old state | Functional update or useRef |
| Event listeners | Handler captures old props/state | useCallback with deps or useRef |
| Async operations | Promise callback uses old values | useRef or check if mounted |
| Memoized callbacks | useCallback with missing deps | Add correct dependencies |

**Q3: Implement a custom hook that returns the previous value**

```tsx
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current; // Returns old value (before useEffect runs)
}

// Usage
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);
// On first render: count=0, prevCount=undefined
// After setCount(5): count=5, prevCount=0
```

**Q4: What is a "callback ref" and when would you use it?**

```tsx
// Callback refs are called with the DOM node when it mounts/unmounts
// Use case: Measure DOM elements, integrate with 3rd party libraries

function MeasuredComponent() {
  const [height, setHeight] = useState(0);
  
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  
  return <div ref={measuredRef}>...</div>;
}
```

### 2.2 useEffect vs useLayoutEffect

```tsx
// useEffect - Asynchronous, after paint
useEffect(() => {
  // Runs after browser paints
  // Good for: data fetching, subscriptions, logging
}, [deps]);

// useLayoutEffect - Synchronous, before paint
useLayoutEffect(() => {
  // Runs before browser paints (blocks visual updates)
  // Good for: DOM measurements, synchronous mutations
}, [deps]);
```

### useLayoutEffect Deep Dive

**Browser Rendering Pipeline:**
```
React + Browser Rendering Flow:

1. State Change (setState)
        |
2. React Render Phase (Virtual DOM diffing)
        |
3. React Commit Phase (DOM mutations applied)
        |
4. useLayoutEffect runs - SYNCHRONOUS, BLOCKS PAINT
        |
5. Browser Paint (pixels on screen)
        |
6. useEffect runs - ASYNCHRONOUS, AFTER PAINT
```

**Visual Comparison:**
```tsx
function FlickerExample() {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  // useEffect - User sees flicker!
  // 1. Initial render: width=0 shown to user
  // 2. Browser paints (user sees width=0)
  // 3. useEffect runs, measures actual width (e.g., 500px)
  // 4. setWidth(500) triggers re-render
  // 5. Browser paints again (user sees width=500)
  // User sees: 0 -> 500 (FLICKER!)
  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);
  
  // useLayoutEffect - No flicker!
  // 1. Initial render: width=0 (not painted yet)
  // 2. useLayoutEffect runs BEFORE paint, measures width
  // 3. setWidth(500) triggers synchronous re-render
  // 4. Browser paints (user sees width=500 directly)
  // User sees: 500 (NO FLICKER!)
  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);
  
  return <div ref={ref}>Width: {width}px</div>;
}
```

**Real-World Use Cases:**

```tsx
// 1. Tooltip/Popover Positioning
function Tooltip({ targetRef, children }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  useLayoutEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      setPosition({
        top: targetRect.bottom + 8,
        left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
      });
    }
  }, [targetRef]);
  
  return (
    <div ref={tooltipRef} style={{ position: 'fixed', ...position }}>
      {children}
    </div>
  );
}

// 2. Scroll Position Restoration
function ChatMessages({ messages }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // New message added - scroll to bottom BEFORE paint
    if (messages.length > prevMessagesLength.current) {
      container.scrollTop = container.scrollHeight;
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);
  
  return <div ref={containerRef}>{/* messages */}</div>;
}

// 3. Animation Starting Position
function AnimatedBox({ isVisible }) {
  const boxRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    if (boxRef.current && isVisible) {
      // Set initial position BEFORE browser paints
      // Then CSS transition handles the animation
      boxRef.current.style.transform = 'translateX(-100%)';
      
      // Force reflow to ensure the initial position is applied
      boxRef.current.getBoundingClientRect();
      
      // Now set final position - CSS transition will animate
      boxRef.current.style.transform = 'translateX(0)';
    }
  }, [isVisible]);
  
  return (
    <div 
      ref={boxRef} 
      style={{ transition: 'transform 0.3s ease' }}
    >
      Animated Content
    </div>
  );
}

// 4. Third-Party Library Integration
function D3Chart({ data }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useLayoutEffect(() => {
    if (!svgRef.current) return;
    
    // D3 directly manipulates DOM
    // Must happen BEFORE paint to avoid flicker
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Draw chart...
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      // ... bindingsalidate
    
  }, [data]);
  
  return <svg ref={svgRef} />;
}

// 5. Focus Management
function Modal({ isOpen, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  
  useLayoutEffect(() => {
    if (isOpen) {
      // Save current focus
      previousActiveElement.current = document.activeElement;
      // Focus modal immediately (before paint)
      modalRef.current?.focus();
    }
    
    return () => {
      // Restore focus when modal closes
      (previousActiveElement.current as HTMLElement)?.focus();
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div ref={modalRef} tabIndex={-1} role="dialog">
      {children}
    </div>
  );
}
```

**useLayoutEffect vs useEffect Decision Tree:**

```
Need to read/write DOM?
        |
   YES          NO
    |            |
    v            v
Will change    useEffect
cause visual   (default)
flicker?
    |
YES     NO
 |       |
 v       v
useLayoutEffect    useEffect
```

**Performance Warning:**

```tsx
// BAD - useLayoutEffect blocks paint!
useLayoutEffect(() => {
  // Heavy computation blocks UI for 500ms
  const result = heavyComputation(); // 500ms
  setData(result);
}, []);
// User sees frozen UI for 500ms!

// GOOD - Move heavy work to useEffect
useLayoutEffect(() => {
  // Only quick DOM measurements here
  const height = ref.current.offsetHeight;
  setHeight(height);
}, []);

useEffect(() => {
  // Heavy computation doesn't block paint
  const result = heavyComputation();
  setData(result);
}, []);
```

**SSR Consideration:**

```tsx
// useLayoutEffect warns during SSR because there's no DOM!
// Solution 1: Use useEffect for SSR-safe code
// Solution 2: useIsomorphicLayoutEffect pattern

import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Now safe to use in SSR
function Component() {
  useIsomorphicLayoutEffect(() => {
    // DOM manipulation
  }, []);
}
```

### useLayoutEffect Interview Questions

**Q1: What happens if you call setState inside useLayoutEffect?**

**A:** The re-render happens **synchronously before paint**. React will:
1. Run useLayoutEffect
2. Process the setState
3. Re-render the component
4. Run useLayoutEffect again (if deps changed)
5. **Then** paint to screen

The user never sees intermediate states!

```tsx
function Example() {
  const [step, setStep] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  
  console.log('Render:', step);
  
  useLayoutEffect(() => {
    console.log('useLayoutEffect:', step);
    if (step === 1) {
      setStep(2); // Triggers SYNCHRONOUS re-render
    }
  }, [step]);
  
  useEffect(() => {
    console.log('useEffect:', step);
  }, [step]);
  
  return <div ref={ref}>Step: {step}</div>;
}

/*
Console output:
  Render: 1
  useLayoutEffect: 1
  Render: 2              <- Synchronous re-render (before paint!)
  useLayoutEffect: 2
  --- Browser Paints --- <- User only sees step=2
  useEffect: 2           <- Runs after paint

User NEVER sees step=1 on screen!
*/
```

**Q2: Can useLayoutEffect cause performance issues?**

**A:** Yes! Since it blocks painting:
- Long-running code freezes the UI
- Multiple synchronous re-renders delay first paint
- Use it only for DOM measurements/mutations that would cause flicker

```tsx
// TERRIBLE - Blocks paint for 2 seconds!
function SlowComponent() {
  useLayoutEffect(() => {
    // Simulating expensive operation
    const start = Date.now();
    while (Date.now() - start < 2000) {
      // Blocking loop - UI completely frozen
    }
  }, []);
  
  return <div>Content</div>;
}

// Timeline:
// 0ms    - Component renders (virtual DOM)
// 0ms    - DOM mutations applied
// 0ms    - useLayoutEffect starts
// 2000ms - useLayoutEffect ends
// 2000ms - Browser finally paints! 
// User sees blank/frozen screen for 2 seconds!

// CORRECT - Only quick measurements in useLayoutEffect
function FastComponent() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    // Quick DOM read - microseconds
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height }); // Sync re-render, but fast
    }
  }, []);
  
  // Heavy processing in useEffect (doesn't block paint)
  useEffect(() => {
    expensiveDataProcessing(dimensions);
  }, [dimensions]);
  
  return <div ref={ref}>...</div>;
}
```

**Q3: Why doesn't useLayoutEffect work with Server Components?**

**A:** Server Components render on the server where there's no DOM. **useLayoutEffect** requires DOM access, so it:
- Shows a warning during SSR
- Only runs on the client after hydration

```tsx
// Warning: useLayoutEffect does nothing on the server

// This happens because:
// 1. Server has no DOM to measure/mutate
// 2. Server can't "block paint" - there's no paint!
// 3. The effect would run on client after hydration anyway

// Solution 1: useIsomorphicLayoutEffect
const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Solution 2: 'use client' directive (Next.js)
'use client'; // This component only runs on client

// Solution 3: Dynamic import with ssr: false (Next.js)
const Tooltip = dynamic(() => import('./Tooltip'), { ssr: false });
```

**Q4: What's the execution order of multiple useLayoutEffect and useEffect hooks?**

```tsx
function Parent() {
  useLayoutEffect(() => console.log('Parent useLayoutEffect'), []);
  useEffect(() => console.log('Parent useEffect'), []);
  return <Child />;
}

function Child() {
  useLayoutEffect(() => console.log('Child useLayoutEffect'), []);
  useEffect(() => console.log('Child useEffect'), []);
  return <div>Child</div>;
}

/*
Execution order:
1. Child useLayoutEffect   <- Children first (bottom-up)
2. Parent useLayoutEffect  <- Then parent
   --- Browser Paints ---
3. Child useEffect         <- Children first (bottom-up)  
4. Parent useEffect        <- Then parent

Why children first? 
React commits changes bottom-up so parent effects can 
rely on children being fully mounted.
*/
```

**Q5: Can you show a real bug that useLayoutEffect fixes?**

```tsx
// BUG: Flickering resize observer
function ResizablePanel() {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  // Using useEffect causes flicker!
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      // This runs AFTER paint, so user sees old width briefly
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      {/* User sees width=0 flash before correct width */}
      <span>Width: {width}px</span>
    </div>
  );
}

// FIX: Measure initial size synchronously
function ResizablePanel() {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  // Synchronous initial measurement - no flicker!
  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);
  
  // Async updates for resize (flicker acceptable during resize)
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      <span>Width: {width}px</span>
    </div>
  );
}
```

### 2.3 useMemo vs useCallback

```tsx
// useMemo - Memoizes a VALUE
const expensiveValue = useMemo(() => {
  return computeExpensive(a, b);
}, [a, b]);

// useCallback - Memoizes a FUNCTION
const memoizedFn = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useCallback is equivalent to:
const memoizedFn = useMemo(() => {
  return () => doSomething(a, b);
}, [a, b]);
```

### 2.4 useReducer - Advanced Patterns

```tsx
// Complex state logic
type State = { count: number; step: number };
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

// Lazy initialization
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

### 2.5 Custom Hooks Patterns

```tsx
// Composing multiple hooks
function useAsync<T>(asyncFn: () => Promise<T>, deps: any[]) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({ data: null, loading: true, error: null });
  
  useEffect(() => {
    let mounted = true;
    
    setState(s => ({ ...s, loading: true }));
    
    asyncFn()
      .then(data => {
        if (mounted) setState({ data, loading: false, error: null });
      })
      .catch(error => {
        if (mounted) setState({ data: null, loading: false, error });
      });
    
    return () => { mounted = false; };
  }, deps);
  
  return state;
}
```

---

## 3. Virtual DOM & Reconciliation

### 3.1 What is Virtual DOM?

The Virtual DOM is a lightweight JavaScript representation of the actual DOM.

```tsx
// JSX
<div className="container">
  <h1>Hello</h1>
</div>

// Virtual DOM representation
{
  type: 'div',
  props: {
    className: 'container',
    children: {
      type: 'h1',
      props: { children: 'Hello' }
    }
  }
}
```

### 3.2 Reconciliation Algorithm (Diffing)

React uses a **heuristic O(n)** algorithm based on two assumptions:

1. **Different types = different trees**: If root elements have different types, React tears down old tree and builds new one
2. **Keys hint at stable identity**: Keys help React identify which items changed in lists

```tsx
// Tree Diffing Process
// Step 1: Compare root elements
// Step 2: If same type, compare attributes/props
// Step 3: Recursively diff children
// Step 4: For lists, use keys to match elements
```

### 3.3 Fiber Architecture (React 16+)

Fiber is React's reconciliation engine that enables:
- **Incremental rendering**: Split rendering work into chunks
- **Pause, abort, or reuse work**: Priority-based scheduling
- **Concurrent features**: Suspense, transitions

```
Fiber Node Structure:
- type (function/class/string)
- key
- stateNode (DOM node / component instance)
- child (first child fiber)
- sibling (next sibling fiber)
- return (parent fiber)
- pendingProps
- memoizedProps
- memoizedState
- effectTag (Placement, Update, Deletion)
- alternate (work-in-progress / current)
```

### 3.4 Two-Phase Rendering

```
Phase 1: Render/Reconciliation (interruptible)
- Build work-in-progress tree
- Calculate changes (effects)
- Can be paused/resumed

Phase 2: Commit (synchronous, cannot be interrupted)
- Apply DOM mutations
- Call lifecycle methods
- Run effects
```

### Virtual DOM Interview Questions

**Q1: Why doesn't React use direct DOM manipulation?**

**A:**
1. **Batching**: Multiple state changes -> single DOM update
2. **Cross-platform**: Same reconciliation for DOM, Native, etc.
3. **Declarative**: Describe UI state, React figures out transitions
4. **Performance**: Minimize expensive DOM operations

**Q2: Why is the key prop important in lists?**

```tsx
// Without keys (or with index as key)
// React can't tell if items were reordered, added, or removed
// It will re-render all items

// With stable keys
// React can identify specific items and minimize DOM operations

// Bad: Using index as key (breaks on reorder)
{items.map((item, index) => <Item key={index} {...item} />)}

// Good: Using unique stable ID
{items.map(item => <Item key={item.id} {...item} />)}
```

**Q3: Explain React's lane model in Fiber**

**A:** Lanes are a bitmask-based priority system:
- **SyncLane**: Highest priority (discrete events like clicks)
- **InputContinuousLane**: Continuous events (drag, scroll)
- **DefaultLane**: Normal updates (setState)
- **TransitionLane**: Low priority (useTransition)
- **IdleLane**: Lowest priority (offscreen updates)

---

## 4. Re-rendering & Performance Optimization

### 4.1 What Triggers Re-renders?

```tsx
// 1. State change
const [count, setCount] = useState(0);
setCount(1); // -> Re-render

// 2. Props change
<Child value={newValue} /> // Child re-renders if value changes

// 3. Parent re-render
function Parent() {
  const [count, setCount] = useState(0);
  return <Child />; // Child re-renders even if no props!
}

// 4. Context change
const value = useContext(MyContext); // Re-renders on context change

// 5. Hooks that trigger re-renders
useReducer, useSyncExternalStore
```

### 4.2 Preventing Unnecessary Re-renders

```tsx
// 1. React.memo - Memoize component
const Child = React.memo(({ value }: { value: string }) => {
  return <div>{value}</div>;
});

// With custom comparison
const Child = React.memo(Component, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id; // Return true to skip re-render
});

// 2. useMemo - Memoize expensive calculations
const expensiveResult = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// 3. useCallback - Memoize callbacks (prevent child re-renders)
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// 4. State colocation - Move state closer to where it's used
function Parent() {
  return (
    <div>
      <ExpensiveTree /> {/* Won't re-render */}
      <Counter /> {/* Has its own state */}
    </div>
  );
}

// 5. Children as props pattern
function Parent({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      {count}
      {children} {/* Won't re-render - created by grandparent */}
    </div>
  );
}
```

### 4.3 Component Composition Patterns

```tsx
// Compound Components
function Tabs({ children }) {
  const [active, setActive] = useState(0);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}
Tabs.Tab = function Tab({ index, children }) {
  const { active, setActive } = useContext(TabsContext);
  return <button onClick={() => setActive(index)}>{children}</button>;
};
Tabs.Panel = function Panel({ index, children }) {
  const { active } = useContext(TabsContext);
  return active === index ? <div>{children}</div> : null;
};

// Render Props
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return render(position);
}

// Higher-Order Components (HOC)
function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user } = useAuth();
    if (!user) return <Login />;
    return <Component {...props} user={user} />;
  };
}
```

### Re-rendering Interview Questions

**Q1: Will this child component re-render?**

```tsx
function Parent() {
  const [count, setCount] = useState(0);
  const data = { value: 'constant' };
  
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Click</button>
      <MemoizedChild data={data} />
    </>
  );
}

const MemoizedChild = React.memo(({ data }) => {
  console.log('Child rendered');
  return <div>{data.value}</div>;
});
```

**A:** Yes! Even though **MemoizedChild** is wrapped in **React.memo**, the **data** object is recreated on every render with a new reference. **React.memo** does shallow comparison, so **{} !== {}**.

**Fix:**
```tsx
const data = useMemo(() => ({ value: 'constant' }), []);
// OR move outside component if truly constant
const data = { value: 'constant' };
function Parent() { ... }
```

**Q2: Explain the "children as props" optimization**

```tsx
// Slow - ExpensiveComponent re-renders on every Parent re-render
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveComponent />
    </div>
  );
}

// Fast - ExpensiveComponent is created by App, not Parent
function App() {
  return (
    <Parent>
      <ExpensiveComponent />
    </Parent>
  );
}

function Parent({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {children}
    </div>
  );
}
```

**Q3: When should you NOT use useMemo/useCallback?**

- Simple calculations (overhead > benefit)
- Primitives that are compared by value
- Functions/values not passed to optimized children
- Creating new arrays/objects that won't benefit from memoization

---

## 5. State Management

### 5.1 React Context

```tsx
// Creating Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// Provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

### 5.2 Redux Deep Dive

```tsx
// Store Setup with Redux Toolkit
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, status: 'idle' },
  reducers: {
    increment: state => { state.value += 1 }, // Immer allows "mutation"
    decrement: state => { state.value -= 1 },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCount.pending, state => { state.status = 'loading' })
      .addCase(fetchCount.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value = action.payload;
      });
  },
});

// Async Thunks
const fetchCount = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  const response = await fetch(`/api/count?amount=${amount}`);
  return response.json();
});

// Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(logger),
});

// Types
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// Typed hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 5.3 Redux Middleware

```tsx
// Logger Middleware
const logger: Middleware = store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

// Async Middleware (simplified thunk)
const thunk: Middleware = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
```

### 5.4 Zustand (Modern Alternative)

```tsx
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface BearState {
  bears: number;
  increase: () => void;
  decrease: () => void;
}

const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: () => set(state => ({ bears: state.bears + 1 })),
        decrease: () => set(state => ({ bears: state.bears - 1 })),
      }),
      { name: 'bear-storage' }
    )
  )
);

// Usage - no Provider needed!
function BearCounter() {
  const bears = useBearStore(state => state.bears);
  return <h1>{bears} bears</h1>;
}
```

### 5.5 State Management Comparison

| Feature | Context | Redux | Zustand | Jotai |
|---------|---------|-------|---------|-------|
| Boilerplate | Low | High | Very Low | Very Low |
| DevTools | NO | YES | YES | YES |
| Persistence | Manual | Manual | Built-in | Built-in |
| Async | Manual | Thunk/Saga | Built-in | Built-in |
| Re-render | All consumers | Selector-based | Selector-based | Atom-based |
| Learning | Easy | Moderate | Easy | Easy |

### State Management Interview Questions

**Q1: What is Redux middleware and how does it work?**

**A:** Middleware is a function that intercepts actions before they reach the reducer. It follows the pattern:
```
dispatch -> middleware1 -> middleware2 -> ... -> reducer
```

Middleware signature: **store => next => action => { ... }**
- **store**: Access to **getState** and **dispatch**
- **next**: Call the next middleware or reducer
- **action**: The dispatched action

**Q2: When would you choose Context over Redux?**

- **Use Context for:**
  - Theme, locale, auth state (infrequent updates)
  - Small apps with simple state
  - Avoiding prop drilling for specific subtrees

- **Use Redux for:**
  - Complex state logic with many actions
  - Frequent updates with performance concerns
  - Need for time-travel debugging
  - Large teams with strict patterns

**Q3: Why does useSelector prevent unnecessary re-renders but useContext doesn't?**

**Context:** Any context value change re-renders ALL consumers, regardless of which part changed.

**useSelector:** Uses strict equality check on selected value. Only re-renders if the selected slice changes.

```tsx
// Context - re-renders on ANY state change
const { user, theme, settings } = useContext(AppContext);

// Redux - only re-renders when user changes
const user = useSelector(state => state.user);
```

---

## 6. Next.js Advanced Concepts

### 6.1 Rendering Strategies

```tsx
// 1. Static Site Generation (SSG) - Build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// 2. Server-Side Rendering (SSR) - Request time
// In App Router, any component is SSR by default
async function Page() {
  const data = await fetch('...'); // Runs on server
  return <div>{data}</div>;
}

// 3. Incremental Static Regeneration (ISR)
async function Page() {
  const data = await fetch('...', { next: { revalidate: 60 } });
  return <div>{data}</div>;
}

// 4. Client-Side Rendering
'use client';
function ClientComponent() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchData().then(setData) }, []);
  return <div>{data}</div>;
}
```

### 6.2 Server Components vs Client Components

```tsx
// Server Component (default in App Router)
// CAN: async/await, access backend, use fs, secrets
// CANNOT: useState, useEffect, onClick, browser APIs
async function ServerComponent() {
  const data = await db.query('SELECT * FROM users');
  return <UserList users={data} />;
}

// Client Component
// CAN: hooks, events, browser APIs
// CANNOT: async component, direct backend access
'use client';
function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 6.3 Server Actions

```tsx
// In Server Component or 'use server' file
async function submitForm(formData: FormData) {
  'use server';
  
  const name = formData.get('name');
  await db.insert({ name });
  revalidatePath('/users');
}

// Usage in form
function Form() {
  return (
    <form action={submitForm}>
      <input name="name" />
      <button type="submit">Submit</button>
    </form>
  );
}

// With useFormState for pending/error states
'use client';
function Form() {
  const [state, action] = useFormState(submitForm, { error: null });
  const { pending } = useFormStatus();
  
  return (
    <form action={action}>
      <input name="name" />
      <button disabled={pending}>{pending ? 'Saving...' : 'Submit'}</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
```

### 6.4 Caching in Next.js

```tsx
// Request Memoization (same request in one render pass)
async function Page() {
  const data1 = await fetch('/api/data'); // Actual fetch
  const data2 = await fetch('/api/data'); // Returns cached result
}

// Data Cache (persistent across requests)
fetch('/api/data', { 
  cache: 'force-cache',     // Cache indefinitely (default)
  // cache: 'no-store',     // No caching
  // next: { revalidate: 60 } // Revalidate after 60s
});

// Full Route Cache (static pages)
// Automatically caches rendered HTML for static routes

// Router Cache (client-side)
// Caches visited routes in browser memory
```

### 6.5 Parallel & Intercepting Routes

```tsx
// Parallel Routes - Render multiple pages simultaneously
// app/@dashboard/page.tsx
// app/@analytics/page.tsx
// app/layout.tsx
function Layout({ children, dashboard, analytics }) {
  return (
    <div>
      {dashboard}
      {analytics}
    </div>
  );
}

// Intercepting Routes - Modal patterns
// app/photos/[id]/page.tsx        - Full page
// app/@modal/(.)photos/[id]/page.tsx - Modal (intercepted)
```

### 6.6 Streaming & Suspense

```tsx
// Streaming with Suspense
import { Suspense } from 'react';

async function SlowComponent() {
  const data = await slowFetch(); // 3 seconds
  return <div>{data}</div>;
}

export default function Page() {
  return (
    <div>
      <h1>Instant Header</h1>
      <Suspense fallback={<Loading />}>
        <SlowComponent /> {/* Streams in when ready */}
      </Suspense>
    </div>
  );
}

// loading.tsx - Automatic Suspense boundary
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />;
}
```

### Next.js Interview Questions

**Q1: Explain the difference between cache: 'force-cache', cache: 'no-store', and revalidate**

| Option | Behavior |
|--------|----------|
| force-cache (default) | Cache indefinitely, serve from cache |
| no-store | Never cache, always fetch fresh |
| revalidate: N | Cache for N seconds, then revalidate |
| revalidate: 0 | Same as no-store |

**Q2: How does Next.js handle Server Components hydration?**

**A:** Server Components don't hydrate! They render to a special format (RSC Payload) that:
1. Contains serialized component tree (not HTML)
2. Sent to client as stream
3. React reconstructs tree without running component code
4. Client Components within are hydrated normally

**Q3: What happens when you import a Server Component into a Client Component?**

**A:** You can't directly import Server Components into Client Components. Instead:
```tsx
// This won't work
'use client';
import ServerComponent from './ServerComponent'; // Error!

// Pass as children instead
'use client';
function ClientComponent({ children }) {
  return <div onClick={...}>{children}</div>;
}

// In parent Server Component
function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
}
```

**Q4: Explain the Partial Prerendering (PPR) feature**

**A:** PPR combines static and dynamic rendering:
1. Static shell is rendered at build time
2. Dynamic holes are marked with Suspense
3. On request, static shell is served instantly
4. Dynamic parts stream in as they complete

```tsx
export const experimental_ppr = true;

export default function Page() {
  return (
    <div>
      <StaticHeader /> {/* In static shell */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent /> {/* Streams in */}
      </Suspense>
    </div>
  );
}
```

---

## 7. Advanced Interview Questions

### 7.1 React Internals

**Q: How does React batch state updates?**

```tsx
function Component() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  
  // React 18+ automatic batching
  function handleClick() {
    setA(1);
    setB(2);
    // Only ONE re-render (batched)
  }
  
  // Even in async code (React 18+)
  async function handleAsync() {
    await fetch('/api');
    setA(1);
    setB(2);
    // Still ONE re-render!
  }
  
  // Force synchronous update
  function handleFlush() {
    flushSync(() => setA(1)); // Re-render immediately
    flushSync(() => setB(2)); // Another re-render
  }
}
```

**Q: Explain React's event system (SyntheticEvent)**

- Events are delegated to root (not individual elements)
- Wraps native events for cross-browser consistency
- Event pooling removed in React 17
- Uses browser's native event system in React 17+

**Q: What is the React Scheduler and how does it work?**

The Scheduler:
1. Manages work priorities (lanes)
2. Uses **requestIdleCallback** polyfill for scheduling
3. Yields to browser between tasks (16ms frames)
4. Enables concurrent features (transitions, suspense)

### 7.2 Performance Deep Dive

**Q: Profile and fix this performance issue**

```tsx
function ExpensiveList({ items, filter }) {
  // Problem: Filters on every render
  const filtered = items.filter(item => item.name.includes(filter));
  
  return (
    <ul>
      {filtered.map(item => (
        // Problem: New function on every render
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

**Solution:**
```tsx
function ExpensiveList({ items, filter }) {
  // Memoize filtered result
  const filtered = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  );
  
  // Memoize click handler
  const handleClick = useCallback((id: string) => {
    // handle click
  }, []);
  
  return (
    <ul>
      {filtered.map(item => (
        <ListItem key={item.id} item={item} onClick={handleClick} />
      ))}
    </ul>
  );
}

// Memoized child component
const ListItem = React.memo(({ item, onClick }) => (
  <li onClick={() => onClick(item.id)}>{item.name}</li>
));
```

### 7.3 Concurrent React

**Q: What is useTransition and when would you use it?**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  function handleChange(e) {
    // Urgent: Update input immediately
    setQuery(e.target.value);
    
    // Non-urgent: Can be interrupted
    startTransition(() => {
      setResults(filterResults(e.target.value));
    });
  }
  
  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList results={results} />
    </div>
  );
}
```

**Q: Explain useDeferredValue**

```tsx
function Search({ query }) {
  // Defers the value, allowing urgent updates to proceed
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  
  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <ExpensiveResults query={deferredQuery} />
    </div>
  );
}
```

### 7.4 Testing

**Q: How would you test a custom hook?**

```tsx
import { renderHook, act } from '@testing-library/react';

// Hook to test
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
}

// Test
test('useCounter', () => {
  const { result } = renderHook(() => useCounter(5));
  
  expect(result.current.count).toBe(5);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(6);
});

// Testing with context
test('useTheme requires ThemeProvider', () => {
  const wrapper = ({ children }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('light');
});
```

### 7.5 Architecture Questions

**Q: Design a real-time collaborative editor state management system**

```tsx
// CRDT-based state management
interface Operation {
  id: string;
  type: 'insert' | 'delete';
  position: number;
  content?: string;
  timestamp: number;
  userId: string;
}

// Operational Transformation or CRDT
function useCollaborativeState(docId: string) {
  const [doc, setDoc] = useState<Document>({ content: '', version: 0 });
  const pending = useRef<Operation[]>([]);
  const ws = useRef<WebSocket>();
  
  // Apply local operation
  const applyOperation = useCallback((op: Operation) => {
    // Optimistic update
    setDoc(d => transform(d, op));
    pending.current.push(op);
    ws.current?.send(JSON.stringify(op));
  }, []);
  
  // Handle remote operations
  useEffect(() => {
    ws.current = new WebSocket(`/doc/${docId}`);
    ws.current.onmessage = (e) => {
      const op = JSON.parse(e.data);
      // Transform against pending local ops
      const transformed = transformAgainst(op, pending.current);
      setDoc(d => transform(d, transformed));
    };
  }, [docId]);
  
  return { doc, applyOperation };
}
```

**Q: How would you implement code splitting with analytics?**

```tsx
// Track component load times
function withLoadTracking<P>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  componentName: string
) {
  return lazy(async () => {
    const start = performance.now();
    const module = await importFn();
    const duration = performance.now() - start;
    
    analytics.track('component_loaded', {
      component: componentName,
      duration,
      timestamp: Date.now(),
    });
    
    return module;
  });
}

// Usage
const Dashboard = withLoadTracking(
  () => import('./Dashboard'),
  'Dashboard'
);
```

---

## 8. Quick Reference

### React 18+ Features
- Automatic batching
- **useTransition** / **useDeferredValue**
- **useId** for SSR-safe IDs
- **useSyncExternalStore** for external stores
- Streaming SSR with Suspense

### Next.js 14+ Features
- App Router (Server Components)
- Server Actions
- Partial Prerendering
- Parallel & Intercepting Routes
- Built-in caching layers

### Performance Checklist
- Use **React.memo** for expensive components
- Memoize callbacks with **useCallback**
- Memoize values with **useMemo**
- Use proper keys in lists
- Code split with **lazy** and **Suspense**
- Virtualize long lists
- Debounce/throttle expensive operations
- Profile with React DevTools

---

*Last Updated: January 2026*
