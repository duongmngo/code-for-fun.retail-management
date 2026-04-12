# Java Programming Language Guide: From Basic to Advanced

> A comprehensive guide to mastering the Java programming language fundamentals, covering everything from basic syntax to advanced features like concurrency, generics, and functional programming.

---

## Table of Contents

1. [Introduction to Java](#1-introduction-to-java)
   - [What is Java?](#11-what-is-java)
   - [How Java Code Executes](#12-how-java-code-executes)
   - [Your First Java Program](#13-your-first-java-program)
   - [Java Evolution: What Changed in the Last 10 Years](#14-java-evolution-what-changed-in-the-last-10-years-2016-2026)
2. [Basic Syntax and Data Types](#2-basic-syntax-and-data-types)
3. [Control Flow](#3-control-flow)
4. [Object-Oriented Programming](#4-object-oriented-programming)
5. [Exception Handling](#5-exception-handling)
6. [Collections Framework](#6-collections-framework)
7. [Generics](#7-generics)
8. [Functional Programming & Lambdas](#8-functional-programming--lambdas)
9. [Streams API](#9-streams-api)
10. [Concurrency & Multithreading](#10-concurrency--multithreading)
11. [Memory Management & JVM](#11-memory-management--jvm)
12. [Modern Java Features (Java 17+)](#12-modern-java-features-java-17)
13. [Best Practices & Design Patterns](#13-best-practices--design-patterns)

---

## 1. Introduction to Java

### 1.1 What is Java?

Java is a statically-typed, object-oriented programming language designed with the principle of "Write Once, Run Anywhere" (WORA). Code compiles to bytecode that runs on the Java Virtual Machine (JVM), making it platform-independent.

**Key Characteristics:**
- **Strongly typed**: Every variable must have a declared type
- **Object-oriented**: Everything is an object (except primitives)
- **Garbage collected**: Automatic memory management
- **Platform independent**: Runs on any device with a JVM
- **Secure**: Built-in security features and sandboxing

### 1.2 How Java Code Executes

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Source Code │ ──▶ │  Compiler   │ ──▶ │  Bytecode   │ ──▶ │     JVM     │
│  (.java)    │     │   (javac)   │     │  (.class)   │     │  Execution  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. You write source code in `.java` files
2. The Java compiler (`javac`) compiles to bytecode (`.class` files)
3. The JVM interprets/JIT-compiles bytecode to machine code
4. Machine code executes on the hardware

### 1.3 Your First Java Program

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**Breaking it down:**
- `public class HelloWorld` - Class declaration (filename must match class name)
- `public static void main(String[] args)` - Entry point of the program
- `System.out.println()` - Prints to standard output with newline

**Compile and run:**
```bash
javac HelloWorld.java    # Compiles to HelloWorld.class
java HelloWorld          # Runs the program
```

### 1.4 Java Evolution: What Changed in the Last 10 Years (2016-2026)

Java has transformed dramatically since adopting a 6-month release cycle in 2017. If you learned Java in the Java 8 era, the language today is significantly more expressive and developer-friendly. Here's a comprehensive overview of major changes:

#### Release Timeline & LTS Versions

| Version | Release | LTS | Highlights |
|---------|---------|-----|------------|
| Java 9 | Sep 2017 | No | Module system, JShell |
| Java 10 | Mar 2018 | No | Local variable type inference (`var`) |
| Java 11 | Sep 2018 | **Yes** | HTTP Client, `String` methods, single-file execution |
| Java 12-16 | 2019-2021 | No | Preview features maturing |
| Java 17 | Sep 2021 | **Yes** | Sealed classes, pattern matching for instanceof |
| Java 18-20 | 2022-2023 | No | Virtual threads preview, structured concurrency |
| Java 21 | Sep 2023 | **Yes** | Virtual threads GA, sequenced collections, pattern matching |
| Java 22-24 | 2024-2025 | No | Unnamed variables, stream gatherers, flexible constructors |
| Java 25 | Sep 2025 | **Yes** | Performance improvements, stabilized features |

#### Major Language Changes by Category

**1. Type Inference & Reduced Boilerplate**
```java
// Java 10: var for local variables
var list = new ArrayList<String>();  // Type inferred
var map = Map.of("key", "value");    // No need to repeat types

// Java 16: Records - immutable data classes in one line
record Person(String name, int age) {}  // Generates constructor, getters, equals, hashCode, toString

// Java 22: Unnamed variables - explicitly ignore values
try {
    // code
} catch (Exception _) {  // We don't need the exception variable
    log.error("Failed");
}
```

**2. Pattern Matching Evolution**
```java
// Java 16: Pattern matching for instanceof
if (obj instanceof String s) {
    System.out.println(s.length());  // s is already cast
}

// Java 17: Sealed classes - restrict inheritance
sealed interface Shape permits Circle, Rectangle, Triangle {}
final class Circle implements Shape {}
non-sealed class Rectangle implements Shape {}

// Java 21: Pattern matching in switch
String describe(Object obj) {
    return switch (obj) {
        case Integer i when i > 0 -> "positive: " + i;
        case Integer i -> "non-positive: " + i;
        case String s -> "string: " + s;
        case null -> "null";
        default -> "unknown";
    };
}

// Java 21: Record patterns - destructure records
record Point(int x, int y) {}
if (obj instanceof Point(int x, int y)) {
    System.out.println("x=" + x + ", y=" + y);
}
```

**3. Text & String Improvements**
```java
// Java 15: Text blocks - multi-line strings
String json = """
    {
        "name": "Alice",
        "age": 30
    }
    """;

// Java 11: New String methods
"  hello  ".strip();          // "hello" (Unicode-aware trim)
"  hello  ".isBlank();        // false
"hello\nworld".lines();       // Stream of lines
"abc".repeat(3);              // "abcabcabc"

// Java 12: New String methods
"hello".indent(4);            // "    hello\n"
"hello".transform(s -> s.toUpperCase());
```

**4. Switch Expressions**
```java
// Java 14: Switch as expression (returns value)
int numLetters = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY -> 7;
    case THURSDAY, SATURDAY -> 8;
    case WEDNESDAY -> 9;
};

// yield for complex blocks
String result = switch (status) {
    case SUCCESS -> "ok";
    case ERROR -> {
        logError();
        yield "failed";
    }
};
```

**5. Concurrency Revolution**
```java
// Java 21: Virtual threads - millions of lightweight threads
Thread.startVirtualThread(() -> doTask());

try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 100_000).forEach(i ->
        executor.submit(() -> blockingIO())  // Each task gets its own virtual thread
    );
}

// Java 21: Structured concurrency (preview → stable)
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Future<User> user = scope.fork(() -> fetchUser(id));
    Future<Orders> orders = scope.fork(() -> fetchOrders(id));
    scope.join();
    scope.throwIfFailed();
    return new Response(user.resultNow(), orders.resultNow());
}
```

**6. Collections Enhancements**
```java
// Java 9: Factory methods for immutable collections
List<String> list = List.of("a", "b", "c");
Set<Integer> set = Set.of(1, 2, 3);
Map<String, Integer> map = Map.of("one", 1, "two", 2);

// Java 10: Collectors improvements
var unmodifiable = list.stream()
    .collect(Collectors.toUnmodifiableList());

// Java 21: Sequenced collections
SequencedCollection<String> seq = new LinkedHashSet<>();
seq.addFirst("first");
seq.addLast("last");
seq.getFirst();
seq.getLast();
seq.reversed();  // Reversed view
```

**7. API Additions**
```java
// Java 9: Optional improvements
optional.ifPresentOrElse(
    value -> process(value),
    () -> handleEmpty()
);
optional.or(() -> Optional.of("default"));
optional.stream();  // Convert to stream

// Java 11: HTTP Client (standardized)
HttpClient client = HttpClient.newHttpClient();
HttpResponse<String> response = client.send(
    HttpRequest.newBuilder()
        .uri(URI.create("https://api.example.com"))
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

// Java 9: Stream improvements
Stream.iterate(0, i -> i < 10, i -> i + 1);  // takeWhile condition
Stream.ofNullable(possiblyNull);
stream.takeWhile(x -> x < 5);
stream.dropWhile(x -> x < 5);

// Java 16: Stream.toList() - convenience method
List<String> list = stream.toList();  // Immutable list
```

**8. JVM & Runtime Improvements**
```java
// Java 9: JShell - interactive REPL
// Run: jshell
// jshell> 1 + 2
// $1 ==> 3

// Java 11: Single-file execution
// java HelloWorld.java  (no javac needed for single file)

// Java 14: Helpful NullPointerExceptions
// Before: "NullPointerException"
// After:  "Cannot invoke String.length() because the return value of getName() is null"

// Java 9: Module system (JPMS)
// module-info.java
module com.myapp {
    requires java.sql;
    exports com.myapp.api;
}
```

**9. Performance & GC**
```java
// New garbage collectors
// Java 11: ZGC (experimental → production in Java 15)
// Java 12: Shenandoah
// Both provide sub-millisecond pause times for large heaps

// JVM flags
-XX:+UseZGC              // Low-latency GC
-XX:+UseShenandoahGC     // Alternative low-latency GC

// Java 21: Generational ZGC (default)
-XX:+UseZGC -XX:+ZGenerational
```

#### Migration Considerations

**From Java 8:**
- `javax.*` packages moved to Jakarta EE (Java 11 removed Java EE modules)
- `sun.*` internal APIs restricted (use `--add-opens` as temporary workaround)
- Reflection on private members requires explicit opt-in
- Consider adopting `var`, records, and switch expressions gradually

**Recommended upgrade path:**
```
Java 8 → Java 11 (LTS) → Java 17 (LTS) → Java 21 (LTS) → Java 25 (LTS)
```

**Key removals:**
- Java 9: Applet API deprecated
- Java 11: Java EE modules, CORBA, JavaFX (moved to separate project)
- Java 15: Nashorn JavaScript engine
- Java 17: RMI Activation, Security Manager deprecated

#### What Makes Modern Java Better

1. **Less boilerplate**: Records, `var`, pattern matching eliminate verbose code
2. **Safer nulls**: Pattern matching, helpful NPEs, Optional improvements
3. **Better concurrency**: Virtual threads make concurrent programming trivial
4. **Expressiveness**: Switch expressions, text blocks, sealed classes
5. **Performance**: New GCs provide sub-millisecond pauses even for TB heaps

If you're still writing Java 8-style code, you're working 2-3x harder than necessary. Modern Java reads almost like Kotlin or Scala while maintaining full backward compatibility.

---

## 2. Basic Syntax and Data Types

### 2.1 Primitive Data Types

Java has 8 primitive types (not objects, stored directly in memory):

| Type | Size | Range | Default | Example |
|------|------|-------|---------|---------|
| `byte` | 8 bits | -128 to 127 | 0 | `byte b = 100;` |
| `short` | 16 bits | -32,768 to 32,767 | 0 | `short s = 1000;` |
| `int` | 32 bits | -2³¹ to 2³¹-1 | 0 | `int i = 42;` |
| `long` | 64 bits | -2⁶³ to 2⁶³-1 | 0L | `long l = 100L;` |
| `float` | 32 bits | ~6-7 decimal digits | 0.0f | `float f = 3.14f;` |
| `double` | 64 bits | ~15 decimal digits | 0.0d | `double d = 3.14159;` |
| `boolean` | 1 bit | true/false | false | `boolean b = true;` |
| `char` | 16 bits | Unicode character | '\u0000' | `char c = 'A';` |

```java
// Primitive examples
int age = 25;
double price = 19.99;
boolean isActive = true;
char grade = 'A';
long population = 8_000_000_000L;  // Underscores for readability (Java 7+)

// Type inference with var (Java 10+)
var name = "Alice";    // Compiler infers String
var count = 42;        // Compiler infers int
```

### 2.2 Reference Types

Everything else in Java is a reference type - it holds a reference (pointer) to an object in memory.

```java
// String - special reference type with literal support
String greeting = "Hello";
String name = new String("World");

// Arrays
int[] numbers = {1, 2, 3, 4, 5};
String[] names = new String[10];  // Array of 10 null references

// Objects
StringBuilder sb = new StringBuilder();
List<String> list = new ArrayList<>();
```

### 2.3 Wrapper Classes

Each primitive has a corresponding wrapper class (for use in collections, generics, etc.):

| Primitive | Wrapper | Autoboxing Example |
|-----------|---------|-------------------|
| `int` | `Integer` | `Integer i = 42;` |
| `double` | `Double` | `Double d = 3.14;` |
| `boolean` | `Boolean` | `Boolean b = true;` |
| `char` | `Character` | `Character c = 'A';` |
| `long` | `Long` | `Long l = 100L;` |

```java
// Autoboxing: primitive → wrapper (automatic)
Integer boxed = 42;

// Unboxing: wrapper → primitive (automatic)
int unboxed = boxed;

// Be careful with null!
Integer maybeNull = null;
int willThrow = maybeNull;  // NullPointerException!

// Integer caching: -128 to 127 are cached
Integer a = 127;
Integer b = 127;
System.out.println(a == b);  // true (same cached object)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);  // false (different objects)
System.out.println(c.equals(d));  // true (same value)
```

### 2.4 Variables and Constants

```java
// Variable declaration and initialization
int age;           // Declaration
age = 25;          // Initialization
int score = 100;   // Declaration + initialization

// Constants (final keyword)
final double PI = 3.14159;
final String COMPANY_NAME = "Acme Corp";
// PI = 3.14;  // Compile error! Cannot reassign final

// Static constants (class-level)
public static final int MAX_SIZE = 100;

// Effectively final (Java 8+) - not declared final but never reassigned
int limit = 10;
// Used in lambdas without explicit final keyword
Runnable r = () -> System.out.println(limit);
```

### 2.5 Operators

**Arithmetic Operators:**
```java
int a = 10, b = 3;
a + b   // 13 (addition)
a - b   // 7 (subtraction)
a * b   // 30 (multiplication)
a / b   // 3 (integer division - truncates)
a % b   // 1 (modulo/remainder)

// Compound assignment
a += 5;   // a = a + 5
a -= 3;   // a = a - 3
a *= 2;   // a = a * 2
a /= 4;   // a = a / 4

// Increment/Decrement
int x = 5;
x++;      // Post-increment: returns 5, then x becomes 6
++x;      // Pre-increment: x becomes 7, returns 7
x--;      // Post-decrement: returns 7, then x becomes 6
--x;      // Pre-decrement: x becomes 5, returns 5
```

**Comparison Operators:**
```java
a == b   // Equal to
a != b   // Not equal to
a > b    // Greater than
a < b    // Less than
a >= b   // Greater than or equal
a <= b   // Less than or equal

// For objects, use .equals() for value comparison
String s1 = new String("hello");
String s2 = new String("hello");
s1 == s2        // false (different objects)
s1.equals(s2)   // true (same value)
```

**Logical Operators:**
```java
boolean p = true, q = false;
p && q   // false (AND - short-circuit)
p || q   // true (OR - short-circuit)
!p       // false (NOT)
p & q    // false (AND - evaluates both)
p | q    // true (OR - evaluates both)
p ^ q    // true (XOR)
```

**Bitwise Operators:**
```java
int x = 5, y = 3;  // x = 0101, y = 0011 in binary
x & y    // 1 (AND: 0001)
x | y    // 7 (OR: 0111)
x ^ y    // 6 (XOR: 0110)
~x       // -6 (NOT: inverts all bits)
x << 1   // 10 (left shift: 1010)
x >> 1   // 2 (right shift: 0010)
x >>> 1  // 2 (unsigned right shift)
```

**Ternary Operator:**
```java
int max = (a > b) ? a : b;
String status = (age >= 18) ? "Adult" : "Minor";
```

### 2.6 Strings

Strings in Java are immutable - every modification creates a new String object.

```java
// String creation
String s1 = "Hello";                    // String literal (pooled)
String s2 = new String("Hello");        // New object (not pooled)
String s3 = "Hello";                    // Same reference as s1 (from pool)

// String pool
System.out.println(s1 == s3);           // true (same pooled reference)
System.out.println(s1 == s2);           // false (s2 is new object)
System.out.println(s1.equals(s2));      // true (same value)

// Common String methods
String text = "Hello, World!";
text.length()                           // 13
text.charAt(0)                          // 'H'
text.substring(0, 5)                    // "Hello"
text.substring(7)                       // "World!"
text.toLowerCase()                      // "hello, world!"
text.toUpperCase()                      // "HELLO, WORLD!"
text.trim()                             // Removes leading/trailing whitespace
text.strip()                            // Unicode-aware trim (Java 11+)
text.contains("World")                  // true
text.startsWith("Hello")                // true
text.endsWith("!")                      // true
text.indexOf("o")                       // 4 (first occurrence)
text.lastIndexOf("o")                   // 8 (last occurrence)
text.replace("World", "Java")           // "Hello, Java!"
text.split(", ")                        // ["Hello", "World!"]
text.isEmpty()                          // false
text.isBlank()                          // false (Java 11+, checks whitespace)

// String concatenation
String full = "Hello" + " " + "World";  // Creates intermediate objects
String name = "Alice";
String greeting = "Hello, " + name;     // OK for simple cases

// StringBuilder for efficient concatenation
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("item").append(i).append(", ");
}
String result = sb.toString();

// String formatting
String formatted = String.format("Name: %s, Age: %d", "Alice", 25);
String formatted2 = "Name: %s, Age: %d".formatted("Alice", 25);  // Java 15+

// Text blocks (Java 15+)
String json = """
    {
        "name": "Alice",
        "age": 25,
        "city": "New York"
    }
    """;

// String methods (Java 11+)
"  hello  ".strip()                     // "hello"
"hello".repeat(3)                       // "hellohellohello"
"line1\nline2\nline3".lines()           // Stream<String>
"  ".isBlank()                          // true
```

### 2.7 Arrays

Arrays are fixed-size, ordered collections of elements of the same type.

```java
// Array declaration and initialization
int[] numbers = new int[5];             // Array of 5 ints (all 0)
int[] primes = {2, 3, 5, 7, 11};        // Array literal
String[] names = new String[]{"Alice", "Bob", "Charlie"};

// Accessing elements (0-indexed)
int first = primes[0];                  // 2
int last = primes[primes.length - 1];   // 11
primes[0] = 1;                          // Modify element

// Array length
int size = primes.length;               // 5 (property, not method)

// Iterating arrays
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// Enhanced for loop (foreach)
for (int num : primes) {
    System.out.println(num);
}

// Multi-dimensional arrays
int[][] matrix = new int[3][3];         // 3x3 matrix
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
int value = grid[1][2];                 // 6 (row 1, col 2)

// Jagged arrays (rows of different lengths)
int[][] jagged = new int[3][];
jagged[0] = new int[2];
jagged[1] = new int[4];
jagged[2] = new int[3];

// Array utilities (java.util.Arrays)
import java.util.Arrays;

Arrays.sort(primes);                    // Sort in place
Arrays.binarySearch(primes, 5);         // Find element (array must be sorted)
Arrays.fill(numbers, 42);               // Fill all elements with 42
Arrays.copyOf(primes, 10);              // Copy with new length
Arrays.copyOfRange(primes, 1, 4);       // Copy range [1, 4)
Arrays.equals(arr1, arr2);              // Compare arrays
Arrays.toString(primes);                // "[2, 3, 5, 7, 11]"
Arrays.deepToString(matrix);            // For multi-dimensional
```

---

## 3. Control Flow

### 3.1 Conditional Statements

**if-else:**
```java
int score = 85;

if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else if (score >= 70) {
    System.out.println("C");
} else {
    System.out.println("F");
}

// Single statement (braces optional but recommended)
if (score > 50) System.out.println("Pass");

// Nested if
if (age >= 18) {
    if (hasLicense) {
        System.out.println("Can drive");
    }
}
```

**switch statement (traditional):**
```java
int day = 3;
String dayName;

switch (day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    case 4:
        dayName = "Thursday";
        break;
    case 5:
        dayName = "Friday";
        break;
    case 6:
    case 7:
        dayName = "Weekend";
        break;
    default:
        dayName = "Invalid";
}

// Switch with strings (Java 7+)
String status = "APPROVED";
switch (status) {
    case "PENDING":
        process();
        break;
    case "APPROVED":
        complete();
        break;
    case "REJECTED":
        cancel();
        break;
}
```

**switch expression (Java 14+):**
```java
// Arrow syntax - no fall-through, no break needed
String dayType = switch (day) {
    case 1, 2, 3, 4, 5 -> "Weekday";
    case 6, 7 -> "Weekend";
    default -> "Invalid";
};

// With yield for complex logic
String description = switch (status) {
    case "PENDING" -> "Awaiting review";
    case "APPROVED" -> {
        log("Order approved");
        yield "Ready to ship";
    }
    case "REJECTED" -> "Order cancelled";
    default -> throw new IllegalStateException("Unknown status: " + status);
};
```

### 3.2 Loops

**for loop:**
```java
// Traditional for loop
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// Multiple variables
for (int i = 0, j = 10; i < j; i++, j--) {
    System.out.println(i + " " + j);
}

// Infinite loop
for (;;) {
    // Loop forever until break
    if (shouldStop) break;
}
```

**Enhanced for loop (foreach):**
```java
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}

List<String> names = List.of("Alice", "Bob", "Charlie");
for (String name : names) {
    System.out.println(name);
}
```

**while loop:**
```java
int count = 0;
while (count < 5) {
    System.out.println(count);
    count++;
}

// Reading input until condition
Scanner scanner = new Scanner(System.in);
String input;
while (!(input = scanner.nextLine()).equals("quit")) {
    process(input);
}
```

**do-while loop:**
```java
// Executes at least once
int num;
do {
    System.out.print("Enter a positive number: ");
    num = scanner.nextInt();
} while (num <= 0);
```

### 3.3 Loop Control

**break:**
```java
// Exit the innermost loop
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // Exits loop when i is 5
    }
    System.out.println(i);
}

// Labeled break for nested loops
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) {
            break outer;  // Exits both loops
        }
        System.out.println(i + "," + j);
    }
}
```

**continue:**
```java
// Skip to next iteration
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // Skip even numbers
    }
    System.out.println(i);  // Prints 1, 3, 5, 7, 9
}

// Labeled continue
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            continue outer;  // Skip to next iteration of outer loop
        }
        System.out.println(i + "," + j);
    }
}
```

---

## 4. Object-Oriented Programming

### 4.1 Classes and Objects

A class is a blueprint for creating objects. An object is an instance of a class.

```java
// Class definition
public class Person {
    // Instance fields (attributes)
    private String name;
    private int age;
    private static int count = 0;  // Class field (shared)
    
    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
        count++;
    }
    
    // Default constructor
    public Person() {
        this("Unknown", 0);  // Calls other constructor
    }
    
    // Instance method
    public void introduce() {
        System.out.println("Hi, I'm " + name + ", " + age + " years old.");
    }
    
    // Getter
    public String getName() {
        return name;
    }
    
    // Setter with validation
    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        }
    }
    
    // Static method (class-level)
    public static int getCount() {
        return count;
    }
    
    // toString override
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}

// Creating objects
Person alice = new Person("Alice", 25);
Person bob = new Person("Bob", 30);
alice.introduce();  // "Hi, I'm Alice, 25 years old."

System.out.println(Person.getCount());  // 2
```

### 4.2 Access Modifiers

| Modifier | Class | Package | Subclass | World |
|----------|-------|---------|----------|-------|
| `public` | ✓ | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| (default) | ✓ | ✓ | ✗ | ✗ |
| `private` | ✓ | ✗ | ✗ | ✗ |

```java
public class BankAccount {
    public String accountNumber;     // Accessible everywhere
    protected double balance;        // Package + subclasses
    String bankName;                 // Package-private (default)
    private String pin;              // Only this class
}
```

### 4.3 Encapsulation

Hide internal implementation details and expose only what's necessary.

```java
public class BankAccount {
    private double balance;
    private final String accountId;
    
    public BankAccount(String accountId, double initialBalance) {
        this.accountId = accountId;
        this.balance = initialBalance;
    }
    
    // Controlled access through methods
    public double getBalance() {
        return balance;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
}
```

### 4.4 Inheritance

A class can inherit fields and methods from a parent class.

```java
// Parent class (superclass)
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void eat() {
        System.out.println(name + " is eating.");
    }
    
    public void sleep() {
        System.out.println(name + " is sleeping.");
    }
}

// Child class (subclass)
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, String breed) {
        super(name);  // Call parent constructor
        this.breed = breed;
    }
    
    // Additional method
    public void bark() {
        System.out.println(name + " says: Woof!");
    }
    
    // Override parent method
    @Override
    public void eat() {
        System.out.println(name + " is eating dog food.");
    }
}

// Usage
Dog buddy = new Dog("Buddy", "Golden Retriever");
buddy.eat();    // "Buddy is eating dog food." (overridden)
buddy.sleep();  // "Buddy is sleeping." (inherited)
buddy.bark();   // "Buddy says: Woof!" (specific to Dog)
```

### 4.5 Polymorphism

Objects can be treated as instances of their parent class.

```java
// Animal reference can hold Dog or Cat objects
Animal animal1 = new Dog("Buddy", "Retriever");
Animal animal2 = new Cat("Whiskers");

// Method called depends on actual object type (runtime polymorphism)
animal1.eat();  // Dog's eat()
animal2.eat();  // Cat's eat()

// Array of Animals holding different types
Animal[] animals = {
    new Dog("Buddy", "Retriever"),
    new Cat("Whiskers"),
    new Bird("Tweety")
};

for (Animal animal : animals) {
    animal.eat();  // Calls appropriate method for each type
}

// Type checking and casting
if (animal1 instanceof Dog) {
    Dog dog = (Dog) animal1;
    dog.bark();  // Can call Dog-specific methods
}

// Pattern matching instanceof (Java 16+)
if (animal1 instanceof Dog dog) {
    dog.bark();  // Variable 'dog' already cast
}
```

### 4.6 Abstract Classes

Abstract classes cannot be instantiated and may contain abstract methods.

```java
public abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // Abstract method - must be implemented by subclasses
    public abstract double area();
    public abstract double perimeter();
    
    // Concrete method - inherited as-is
    public void display() {
        System.out.println("Color: " + color);
        System.out.println("Area: " + area());
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}

public class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double area() {
        return width * height;
    }
    
    @Override
    public double perimeter() {
        return 2 * (width + height);
    }
}
```

### 4.7 Interfaces

Interfaces define contracts that classes must implement.

```java
// Interface definition
public interface Drawable {
    // Constants (implicitly public static final)
    int DEFAULT_COLOR = 0xFFFFFF;
    
    // Abstract methods (implicitly public abstract)
    void draw();
    void resize(double factor);
    
    // Default method (Java 8+)
    default void display() {
        System.out.println("Displaying drawable");
        draw();
    }
    
    // Static method (Java 8+)
    static Drawable empty() {
        return new Drawable() {
            @Override
            public void draw() { }
            @Override
            public void resize(double factor) { }
        };
    }
    
    // Private method (Java 9+) - for code reuse in default methods
    private void logAction(String action) {
        System.out.println("Action: " + action);
    }
}

// Multiple interface implementation
public interface Clickable {
    void onClick();
}

public interface Draggable {
    void onDrag(int x, int y);
}

public class Button implements Drawable, Clickable {
    @Override
    public void draw() {
        System.out.println("Drawing button");
    }
    
    @Override
    public void resize(double factor) {
        System.out.println("Resizing button by " + factor);
    }
    
    @Override
    public void onClick() {
        System.out.println("Button clicked!");
    }
}

// Functional interface (single abstract method)
@FunctionalInterface
public interface Processor<T> {
    T process(T input);
    
    // Can have default/static methods, but only ONE abstract method
    default Processor<T> andThen(Processor<T> after) {
        return input -> after.process(this.process(input));
    }
}
```

### 4.8 Sealed Classes (Java 17+)

Control which classes can extend/implement your class/interface.

```java
// Only specific classes can extend Shape
public sealed class Shape permits Circle, Rectangle, Triangle {
    // ...
}

// Permitted subclasses must be final, sealed, or non-sealed
public final class Circle extends Shape { }

public sealed class Rectangle extends Shape permits Square { }

public non-sealed class Triangle extends Shape { }  // Open for extension

// Sealed interfaces
public sealed interface Expr permits Constant, Add, Multiply {
    int evaluate();
}

public record Constant(int value) implements Expr {
    public int evaluate() { return value; }
}

public record Add(Expr left, Expr right) implements Expr {
    public int evaluate() { return left.evaluate() + right.evaluate(); }
}
```

### 4.9 Records (Java 16+)

Concise syntax for immutable data carriers.

```java
// Traditional class
public class PersonOld {
    private final String name;
    private final int age;
    
    public PersonOld(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() { return name; }
    public int getAge() { return age; }
    
    @Override
    public boolean equals(Object o) { /* ... */ }
    @Override
    public int hashCode() { /* ... */ }
    @Override
    public String toString() { /* ... */ }
}

// Record - equivalent in one line!
public record Person(String name, int age) { }

// Usage
Person alice = new Person("Alice", 25);
alice.name()   // "Alice" (accessor method, not getName)
alice.age()    // 25

// Records with validation
public record Email(String value) {
    // Compact constructor for validation
    public Email {
        if (value == null || !value.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        value = value.toLowerCase();  // Normalize
    }
}

// Records with additional methods
public record Point(int x, int y) {
    // Static factory
    public static Point origin() {
        return new Point(0, 0);
    }
    
    // Instance method
    public Point translate(int dx, int dy) {
        return new Point(x + dx, y + dy);
    }
    
    // Derived property
    public double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }
}
```

### 4.10 Enums

Type-safe constants with associated behavior.

```java
// Simple enum
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

// Usage
Day today = Day.MONDAY;
Day[] days = Day.values();          // All enum constants
Day day = Day.valueOf("MONDAY");    // Parse from string
int ordinal = today.ordinal();      // 0 (position)
String name = today.name();         // "MONDAY"

// Enum with fields and methods
public enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    VENUS(4.869e+24, 6.0518e6),
    EARTH(5.976e+24, 6.37814e6),
    MARS(6.421e+23, 3.3972e6);
    
    private final double mass;    // kg
    private final double radius;  // m
    
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }
    
    public double mass() { return mass; }
    public double radius() { return radius; }
    
    public double surfaceGravity() {
        final double G = 6.67300E-11;
        return G * mass / (radius * radius);
    }
}

// Enum with abstract method
public enum Operation {
    ADD {
        @Override
        public int apply(int a, int b) { return a + b; }
    },
    SUBTRACT {
        @Override
        public int apply(int a, int b) { return a - b; }
    },
    MULTIPLY {
        @Override
        public int apply(int a, int b) { return a * b; }
    };
    
    public abstract int apply(int a, int b);
}

// Usage
int result = Operation.ADD.apply(5, 3);  // 8
```

### 4.11 Inner and Nested Classes

```java
public class Outer {
    private int outerField = 10;
    
    // Static nested class - doesn't need Outer instance
    public static class StaticNested {
        public void show() {
            // Cannot access outerField (non-static)
            System.out.println("Static nested class");
        }
    }
    
    // Inner class - requires Outer instance
    public class Inner {
        public void show() {
            // Can access outer class members
            System.out.println("Inner class, outerField = " + outerField);
        }
    }
    
    public void method() {
        int localVar = 20;  // Must be effectively final
        
        // Local class - defined inside method
        class Local {
            public void show() {
                System.out.println("Local class, localVar = " + localVar);
            }
        }
        
        new Local().show();
        
        // Anonymous class - inline class definition
        Runnable r = new Runnable() {
            @Override
            public void run() {
                System.out.println("Anonymous class");
            }
        };
    }
}

// Usage
Outer.StaticNested staticNested = new Outer.StaticNested();
Outer.Inner inner = new Outer().new Inner();
```

---

## 5. Exception Handling

### 5.1 Exception Hierarchy

```
                     Throwable
                    /         \
               Error          Exception
              /     \         /        \
    OutOfMemoryError  ...  IOException  RuntimeException
    StackOverflowError        |         /     |      \
                        SQLException  NPE  IAE  IndexOutOfBounds
```

- **Error**: Serious problems (JVM issues) - don't catch
- **Checked Exceptions**: Must be handled (IOException, SQLException)
- **Unchecked Exceptions**: RuntimeException and subclasses - optional handling

### 5.2 Try-Catch-Finally

```java
public void readFile(String path) {
    FileReader reader = null;
    try {
        reader = new FileReader(path);
        // Read file...
    } catch (FileNotFoundException e) {
        System.err.println("File not found: " + e.getMessage());
    } catch (IOException e) {
        System.err.println("IO error: " + e.getMessage());
    } finally {
        // Always executes (cleanup)
        if (reader != null) {
            try {
                reader.close();
            } catch (IOException e) {
                // Log and ignore
            }
        }
    }
}

// Multi-catch (Java 7+)
try {
    // risky code
} catch (IOException | SQLException e) {
    handleError(e);
}
```

### 5.3 Try-with-Resources (Java 7+)

Automatically closes resources implementing AutoCloseable.

```java
// Resources are automatically closed
try (FileReader reader = new FileReader("file.txt");
     BufferedReader br = new BufferedReader(reader)) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Multiple resources - closed in reverse order

// Effectively final resources (Java 9+)
FileReader reader = new FileReader("file.txt");
try (reader) {  // reader is effectively final
    // use reader
}
```

### 5.4 Throwing Exceptions

```java
public void validateAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
    if (age > 150) {
        throw new IllegalArgumentException("Age seems unrealistic");
    }
}

// Declaring checked exceptions
public void readConfig(String path) throws IOException, ConfigException {
    // Method may throw these exceptions
}
```

### 5.5 Custom Exceptions

```java
// Custom checked exception
public class InsufficientFundsException extends Exception {
    private final double amount;
    private final double balance;
    
    public InsufficientFundsException(double amount, double balance) {
        super(String.format(
            "Cannot withdraw %.2f, balance is only %.2f", amount, balance));
        this.amount = amount;
        this.balance = balance;
    }
    
    public double getAmount() { return amount; }
    public double getBalance() { return balance; }
}

// Custom unchecked exception
public class OrderNotFoundException extends RuntimeException {
    private final String orderId;
    
    public OrderNotFoundException(String orderId) {
        super("Order not found: " + orderId);
        this.orderId = orderId;
    }
    
    public String getOrderId() { return orderId; }
}

// Usage
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) {
        throw new InsufficientFundsException(amount, balance);
    }
    balance -= amount;
}
```

### 5.6 Best Practices

```java
// 1. Catch specific exceptions, not generic Exception
try {
    riskyOperation();
} catch (FileNotFoundException e) {
    // Handle missing file
} catch (IOException e) {
    // Handle other IO errors
}
// NOT: catch (Exception e)

// 2. Don't swallow exceptions
try {
    riskyOperation();
} catch (IOException e) {
    log.error("Operation failed", e);  // At minimum, log it
    throw new ServiceException("Operation failed", e);  // Or re-throw wrapped
}

// 3. Use exceptions for exceptional conditions, not flow control
// BAD
try {
    int value = array[index];
} catch (ArrayIndexOutOfBoundsException e) {
    // Handle out of bounds
}

// GOOD
if (index >= 0 && index < array.length) {
    int value = array[index];
}

// 4. Preserve exception chain
try {
    lowLevelOperation();
} catch (SQLException e) {
    throw new DataAccessException("Database error", e);  // Include cause
}

// 5. Document thrown exceptions
/**
 * Withdraws amount from account.
 * @param amount the amount to withdraw
 * @throws InsufficientFundsException if balance is insufficient
 * @throws IllegalArgumentException if amount is negative
 */
public void withdraw(double amount) throws InsufficientFundsException {
    // ...
}
```

---

## 6. Collections Framework

### 6.1 Collection Hierarchy

```
                        Iterable
                           │
                       Collection
                      /    |     \
                   List   Set    Queue
                  /   \    |    /    \
          ArrayList  Deque  HashSet  PriorityQueue
          LinkedList   |   TreeSet
                   ArrayDeque
                      
                        Map (separate hierarchy)
                       /   \
                  HashMap  TreeMap
                     |
              LinkedHashMap
```

### 6.2 Lists

Ordered collections allowing duplicates.

```java
// ArrayList - dynamic array (fast random access)
List<String> arrayList = new ArrayList<>();
arrayList.add("Apple");
arrayList.add("Banana");
arrayList.add(1, "Orange");     // Insert at index
arrayList.get(0);               // "Apple"
arrayList.set(0, "Apricot");    // Replace
arrayList.remove("Banana");     // Remove by value
arrayList.remove(0);            // Remove by index
arrayList.size();               // 1
arrayList.isEmpty();            // false
arrayList.contains("Orange");   // true
arrayList.indexOf("Orange");    // 0

// LinkedList - doubly-linked list (fast insertion/deletion)
List<String> linkedList = new LinkedList<>();
LinkedList<String> deque = new LinkedList<>();
deque.addFirst("First");
deque.addLast("Last");
deque.removeFirst();
deque.peekFirst();

// Immutable lists
List<String> immutable = List.of("A", "B", "C");
// immutable.add("D");  // UnsupportedOperationException

// Convert array to list
List<String> fromArray = Arrays.asList("A", "B", "C");
List<String> mutableCopy = new ArrayList<>(fromArray);

// Common operations
Collections.sort(arrayList);
Collections.reverse(arrayList);
Collections.shuffle(arrayList);
Collections.max(arrayList);
Collections.min(arrayList);
Collections.binarySearch(arrayList, "Orange");  // List must be sorted
```

### 6.3 Sets

Unique elements, no duplicates.

```java
// HashSet - unordered, O(1) operations
Set<String> hashSet = new HashSet<>();
hashSet.add("Apple");
hashSet.add("Banana");
hashSet.add("Apple");           // Duplicate ignored
hashSet.size();                 // 2
hashSet.contains("Apple");      // true
hashSet.remove("Apple");

// LinkedHashSet - maintains insertion order
Set<String> linkedSet = new LinkedHashSet<>();
linkedSet.add("C");
linkedSet.add("A");
linkedSet.add("B");
// Iteration order: C, A, B

// TreeSet - sorted order, O(log n) operations
Set<String> treeSet = new TreeSet<>();
treeSet.add("Banana");
treeSet.add("Apple");
treeSet.add("Cherry");
// Iteration order: Apple, Banana, Cherry (alphabetical)

// NavigableSet operations
TreeSet<Integer> nums = new TreeSet<>(List.of(1, 3, 5, 7, 9));
nums.ceiling(4);   // 5 (smallest >= 4)
nums.floor(4);     // 3 (largest <= 4)
nums.higher(5);    // 7 (smallest > 5)
nums.lower(5);     // 3 (largest < 5)
nums.subSet(3, 7); // [3, 5] (exclusive end)

// Set operations
Set<Integer> a = new HashSet<>(List.of(1, 2, 3, 4));
Set<Integer> b = new HashSet<>(List.of(3, 4, 5, 6));

Set<Integer> union = new HashSet<>(a);
union.addAll(b);           // {1, 2, 3, 4, 5, 6}

Set<Integer> intersection = new HashSet<>(a);
intersection.retainAll(b); // {3, 4}

Set<Integer> difference = new HashSet<>(a);
difference.removeAll(b);   // {1, 2}
```

### 6.4 Maps

Key-value pairs.

```java
// HashMap - unordered, O(1) operations
Map<String, Integer> hashMap = new HashMap<>();
hashMap.put("Alice", 25);
hashMap.put("Bob", 30);
hashMap.put("Alice", 26);       // Updates value
hashMap.get("Alice");           // 26
hashMap.getOrDefault("Eve", 0); // 0 (default if not found)
hashMap.containsKey("Alice");   // true
hashMap.containsValue(26);      // true
hashMap.remove("Bob");
hashMap.size();                 // 1

// Iterating maps
for (String key : hashMap.keySet()) {
    System.out.println(key);
}

for (Integer value : hashMap.values()) {
    System.out.println(value);
}

for (Map.Entry<String, Integer> entry : hashMap.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

hashMap.forEach((k, v) -> System.out.println(k + ": " + v));

// LinkedHashMap - maintains insertion order
Map<String, Integer> linkedMap = new LinkedHashMap<>();

// TreeMap - sorted by keys
Map<String, Integer> treeMap = new TreeMap<>();
treeMap.put("Banana", 2);
treeMap.put("Apple", 1);
treeMap.put("Cherry", 3);
// Iteration order: Apple, Banana, Cherry

// Compute methods (Java 8+)
map.compute("key", (k, v) -> v == null ? 1 : v + 1);
map.computeIfAbsent("key", k -> expensiveComputation());
map.computeIfPresent("key", (k, v) -> v * 2);
map.merge("key", 1, Integer::sum);  // Increment or set to 1

// Immutable maps
Map<String, Integer> immutable = Map.of("A", 1, "B", 2, "C", 3);
Map<String, Integer> fromEntries = Map.ofEntries(
    Map.entry("A", 1),
    Map.entry("B", 2)
);
```

### 6.5 Queues and Deques

```java
// Queue - FIFO
Queue<String> queue = new LinkedList<>();
queue.offer("First");           // Add to end (returns false if full)
queue.add("Second");            // Add to end (throws if full)
queue.peek();                   // View head (null if empty)
queue.element();                // View head (throws if empty)
queue.poll();                   // Remove head (null if empty)
queue.remove();                 // Remove head (throws if empty)

// PriorityQueue - elements ordered by natural order or comparator
PriorityQueue<Integer> pq = new PriorityQueue<>();  // Min-heap
pq.offer(5);
pq.offer(1);
pq.offer(3);
pq.poll();  // 1 (smallest)

PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

// Deque - double-ended queue
Deque<String> deque = new ArrayDeque<>();
deque.addFirst("First");
deque.addLast("Last");
deque.offerFirst("New First");
deque.pollFirst();              // Remove from front
deque.pollLast();               // Remove from back

// Use Deque as Stack (LIFO)
Deque<String> stack = new ArrayDeque<>();
stack.push("Bottom");
stack.push("Middle");
stack.push("Top");
stack.pop();                    // "Top"
stack.peek();                   // "Middle"
```

### 6.6 Utility Classes

```java
// Collections utility class
Collections.sort(list);
Collections.sort(list, Comparator.reverseOrder());
Collections.shuffle(list);
Collections.reverse(list);
Collections.swap(list, 0, 1);
Collections.rotate(list, 2);
Collections.fill(list, "default");
Collections.copy(dest, src);
Collections.nCopies(5, "hello");      // List of 5 "hello"
Collections.frequency(list, "item");  // Count occurrences
Collections.disjoint(list1, list2);   // True if no common elements

// Unmodifiable wrappers
List<String> unmodifiable = Collections.unmodifiableList(list);
Set<String> syncSet = Collections.synchronizedSet(set);

// Singleton collections
List<String> single = Collections.singletonList("only");
Set<String> singleSet = Collections.singleton("only");
Map<String, Integer> singleMap = Collections.singletonMap("key", 1);

// Empty collections
List<String> empty = Collections.emptyList();
Set<String> emptySet = Collections.emptySet();
Map<String, Integer> emptyMap = Collections.emptyMap();
```

### 6.7 Comparable and Comparator

```java
// Comparable - natural ordering (in the class)
public class Person implements Comparable<Person> {
    private String name;
    private int age;
    
    @Override
    public int compareTo(Person other) {
        return this.name.compareTo(other.name);  // Sort by name
    }
}

List<Person> people = new ArrayList<>();
Collections.sort(people);  // Uses compareTo

// Comparator - external comparison
Comparator<Person> byAge = (p1, p2) -> Integer.compare(p1.getAge(), p2.getAge());
Comparator<Person> byAge2 = Comparator.comparingInt(Person::getAge);
Comparator<Person> byName = Comparator.comparing(Person::getName);

// Chained comparators
Comparator<Person> byAgeDescThenName = Comparator
    .comparingInt(Person::getAge).reversed()
    .thenComparing(Person::getName);

// Null-safe comparators
Comparator<String> nullLast = Comparator.nullsLast(String::compareTo);
Comparator<String> nullFirst = Comparator.nullsFirst(String::compareTo);

// Using comparators
Collections.sort(people, byAge);
people.sort(byAge);
list.stream().sorted(byAge).toList();
```

---

## 7. Generics

### 7.1 Why Generics?

```java
// Without generics - not type-safe
List list = new ArrayList();
list.add("hello");
list.add(123);  // Compiles but causes issues
String s = (String) list.get(1);  // ClassCastException at runtime!

// With generics - type-safe
List<String> stringList = new ArrayList<>();
stringList.add("hello");
// stringList.add(123);  // Compile error!
String s = stringList.get(0);  // No cast needed
```

### 7.2 Generic Classes

```java
// Generic class with one type parameter
public class Box<T> {
    private T content;
    
    public void set(T content) {
        this.content = content;
    }
    
    public T get() {
        return content;
    }
}

Box<String> stringBox = new Box<>();
stringBox.set("Hello");
String value = stringBox.get();

Box<Integer> intBox = new Box<>();
intBox.set(42);
Integer num = intBox.get();

// Multiple type parameters
public class Pair<K, V> {
    private K key;
    private V value;
    
    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
    
    public K getKey() { return key; }
    public V getValue() { return value; }
}

Pair<String, Integer> pair = new Pair<>("Age", 25);
```

### 7.3 Generic Methods

```java
public class Utility {
    // Generic method
    public static <T> T getFirst(List<T> list) {
        return list.isEmpty() ? null : list.get(0);
    }
    
    // Multiple type parameters
    public static <T, U> Pair<T, U> makePair(T first, U second) {
        return new Pair<>(first, second);
    }
    
    // Type parameter can be inferred
    String first = Utility.getFirst(List.of("A", "B", "C"));
    Pair<String, Integer> pair = Utility.makePair("Key", 100);
    
    // Explicit type (rarely needed)
    String explicit = Utility.<String>getFirst(stringList);
}
```

### 7.4 Bounded Type Parameters

```java
// Upper bound - T must be Number or subclass
public class Calculator<T extends Number> {
    public double sum(List<T> numbers) {
        return numbers.stream()
            .mapToDouble(Number::doubleValue)
            .sum();
    }
}

Calculator<Integer> intCalc = new Calculator<>();
Calculator<Double> doubleCalc = new Calculator<>();
// Calculator<String> stringCalc;  // Compile error!

// Multiple bounds
public class Processor<T extends Comparable<T> & Serializable> {
    // T must implement both interfaces
}

// In methods
public static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) > 0 ? a : b;
}
```

### 7.5 Wildcards

```java
// Unbounded wildcard - any type
public void printList(List<?> list) {
    for (Object item : list) {
        System.out.println(item);
    }
}

// Upper bounded wildcard - read only (producer)
public double sumNumbers(List<? extends Number> numbers) {
    double sum = 0;
    for (Number n : numbers) {
        sum += n.doubleValue();
    }
    return sum;
}

// Works with any List of Number or subclass
sumNumbers(List.of(1, 2, 3));           // List<Integer>
sumNumbers(List.of(1.1, 2.2, 3.3));     // List<Double>

// Lower bounded wildcard - write only (consumer)
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    list.add(3);
}

// Works with List<Integer>, List<Number>, List<Object>
addNumbers(new ArrayList<Integer>());
addNumbers(new ArrayList<Number>());
addNumbers(new ArrayList<Object>());
```

### 7.6 PECS Principle

**P**roducer **E**xtends, **C**onsumer **S**uper

```java
// If you only READ from a collection, use extends (producer)
public void copy(List<? extends T> source, List<? super T> dest) {
    for (T item : source) {    // source is producer (extends)
        dest.add(item);        // dest is consumer (super)
    }
}

// Collection.copy signature
public static <T> void copy(List<? super T> dest, List<? extends T> src)
```

### 7.7 Type Erasure

Generics are compile-time only. At runtime, type information is erased.

```java
// At compile time
List<String> strings = new ArrayList<>();
List<Integer> integers = new ArrayList<>();

// At runtime (after erasure)
List strings = new ArrayList();  // Same type
List integers = new ArrayList(); // Same type

// Implications:
// 1. Cannot use instanceof with generic types
// if (list instanceof List<String>)  // Compile error

// 2. Cannot create arrays of generic types
// T[] array = new T[10];  // Compile error

// 3. Cannot use primitives as type parameters
// List<int> ints;  // Compile error - use List<Integer>

// Workaround for type tokens
public class TypeToken<T> {
    private final Type type;
    
    protected TypeToken() {
        Type superclass = getClass().getGenericSuperclass();
        this.type = ((ParameterizedType) superclass).getActualTypeArguments()[0];
    }
}

TypeToken<List<String>> token = new TypeToken<List<String>>() {};
```

---

## 8. Functional Programming & Lambdas

### 8.1 Functional Interfaces

An interface with exactly one abstract method.

```java
// Built-in functional interfaces (java.util.function)
Function<String, Integer>   // T -> R
BiFunction<T, U, R>         // (T, U) -> R
Predicate<T>                // T -> boolean
BiPredicate<T, U>           // (T, U) -> boolean
Consumer<T>                 // T -> void
BiConsumer<T, U>            // (T, U) -> void
Supplier<T>                 // () -> T
UnaryOperator<T>            // T -> T
BinaryOperator<T>           // (T, T) -> T

// Examples
Function<String, Integer> length = s -> s.length();
Predicate<Integer> isPositive = n -> n > 0;
Consumer<String> printer = s -> System.out.println(s);
Supplier<Double> random = () -> Math.random();
BinaryOperator<Integer> add = (a, b) -> a + b;

// Custom functional interface
@FunctionalInterface
public interface Transformer<T, R> {
    R transform(T input);
    
    // Can have default and static methods
    default Transformer<T, R> andThen(Transformer<R, R> after) {
        return input -> after.transform(this.transform(input));
    }
}
```

### 8.2 Lambda Expressions

```java
// Lambda syntax: (parameters) -> expression or { statements }

// No parameters
Runnable r = () -> System.out.println("Hello");

// One parameter (parentheses optional)
Consumer<String> c = s -> System.out.println(s);
Consumer<String> c2 = (s) -> System.out.println(s);

// Multiple parameters
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;

// With explicit types
BiFunction<Integer, Integer, Integer> multiply = 
    (Integer a, Integer b) -> a * b;

// Multi-line body (requires braces and return)
Function<Integer, String> classify = n -> {
    if (n < 0) return "negative";
    if (n == 0) return "zero";
    return "positive";
};

// Accessing outer variables (must be effectively final)
int multiplier = 2;
Function<Integer, Integer> doubler = n -> n * multiplier;
// multiplier = 3;  // Would make lambda invalid
```

### 8.3 Method References

Shorthand for lambdas that just call a method.

```java
// Static method reference: ClassName::staticMethod
Function<String, Integer> parse = Integer::parseInt;
// Equivalent to: s -> Integer.parseInt(s)

// Instance method on parameter: ClassName::instanceMethod
Function<String, Integer> len = String::length;
// Equivalent to: s -> s.length()

// Instance method on specific object: object::instanceMethod
String prefix = "Hello, ";
Function<String, String> greet = prefix::concat;
// Equivalent to: s -> prefix.concat(s)

// Constructor reference: ClassName::new
Supplier<ArrayList<String>> listFactory = ArrayList::new;
// Equivalent to: () -> new ArrayList<>()

Function<Integer, int[]> arrayFactory = int[]::new;
// Equivalent to: size -> new int[size]

// Examples in context
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// Using method reference
names.forEach(System.out::println);

// Sorting with method reference
names.sort(String::compareToIgnoreCase);

// Mapping with constructor reference
List<Person> people = names.stream()
    .map(Person::new)  // Calls Person(String name) constructor
    .toList();
```

### 8.4 Closures and Variable Capture

```java
public class ClosureExample {
    
    public Function<Integer, Integer> createAdder(int valueToAdd) {
        // valueToAdd is captured by the lambda
        return n -> n + valueToAdd;
    }
    
    public void demonstrateCapture() {
        int base = 10;  // Must be effectively final
        
        Runnable r = () -> {
            System.out.println(base);  // Captures base
            // base = 20;  // Compile error!
        };
        
        // Arrays/objects can change (reference is final, contents aren't)
        int[] counter = {0};
        Runnable increment = () -> counter[0]++;  // OK
    }
}
```

### 8.5 Composing Functions

```java
// Function composition
Function<Integer, Integer> times2 = x -> x * 2;
Function<Integer, Integer> plus3 = x -> x + 3;

// andThen: apply first, then second
Function<Integer, Integer> times2ThenPlus3 = times2.andThen(plus3);
times2ThenPlus3.apply(5);  // (5 * 2) + 3 = 13

// compose: apply second first, then first
Function<Integer, Integer> plus3ThenTimes2 = times2.compose(plus3);
plus3ThenTimes2.apply(5);  // (5 + 3) * 2 = 16

// Predicate composition
Predicate<Integer> isPositive = x -> x > 0;
Predicate<Integer> isEven = x -> x % 2 == 0;

Predicate<Integer> isPositiveAndEven = isPositive.and(isEven);
Predicate<Integer> isPositiveOrEven = isPositive.or(isEven);
Predicate<Integer> isNotPositive = isPositive.negate();

// Consumer composition
Consumer<String> print = System.out::println;
Consumer<String> log = s -> logger.info(s);
Consumer<String> printAndLog = print.andThen(log);
```

### 8.6 Optional

Container that may or may not contain a value. Avoids null checks.

```java
// Creating Optional
Optional<String> present = Optional.of("Hello");
Optional<String> empty = Optional.empty();
Optional<String> nullable = Optional.ofNullable(maybeNull);  // null-safe

// Checking presence
present.isPresent()  // true
present.isEmpty()    // false (Java 11+)

// Getting value
present.get()                    // "Hello" (throws if empty)
present.orElse("default")        // "Hello"
empty.orElse("default")          // "default"
empty.orElseGet(() -> compute()) // Lazy default
empty.orElseThrow()              // NoSuchElementException
empty.orElseThrow(() -> new CustomException())

// Transforming
Optional<Integer> length = present.map(String::length);  // Optional<5>
Optional<Character> first = present.map(s -> s.charAt(0));

// Flat mapping (when mapper returns Optional)
Optional<String> result = findUser(id)
    .flatMap(user -> findAddress(user))
    .flatMap(address -> findCity(address));

// Filtering
Optional<String> longString = present
    .filter(s -> s.length() > 3);  // Optional<"Hello">

// Conditional execution
present.ifPresent(System.out::println);
present.ifPresentOrElse(
    System.out::println,    // if present
    () -> log("empty")      // if empty (Java 9+)
);

// Chaining (Java 9+)
Optional<String> result = primary.or(() -> secondary);  // Try primary, then secondary

// Stream integration (Java 9+)
Stream<String> stream = optional.stream();  // 0 or 1 elements

// Pattern: Return Optional instead of null
public Optional<User> findById(Long id) {
    User user = repository.find(id);
    return Optional.ofNullable(user);
}
```

---

## 9. Streams API

### 9.1 Stream Basics

Streams are sequences of elements supporting sequential and parallel operations.

```java
// Creating streams
Stream<String> fromList = List.of("a", "b", "c").stream();
Stream<String> fromArray = Arrays.stream(new String[]{"a", "b", "c"});
Stream<Integer> range = IntStream.range(1, 10).boxed();  // 1-9
Stream<Integer> rangeClosed = IntStream.rangeClosed(1, 10).boxed();  // 1-10
Stream<String> generated = Stream.generate(() -> "hello").limit(5);
Stream<Integer> iterated = Stream.iterate(1, n -> n * 2).limit(10);

// Primitive streams (avoid boxing overhead)
IntStream intStream = IntStream.of(1, 2, 3);
LongStream longStream = LongStream.range(0, 1000);
DoubleStream doubleStream = DoubleStream.of(1.1, 2.2, 3.3);

// Stream characteristics:
// - NOT a data structure (doesn't store elements)
// - Lazy evaluation (intermediate operations create new streams)
// - Can be consumed only once
// - Can be parallel
```

### 9.2 Intermediate Operations

Transform a stream into another stream (lazy, not executed until terminal op).

```java
List<String> words = List.of("hello", "world", "java", "stream");

// filter - keep elements matching predicate
words.stream()
    .filter(s -> s.length() > 4)  // "hello", "world", "stream"

// map - transform each element
words.stream()
    .map(String::toUpperCase)     // "HELLO", "WORLD", ...

// flatMap - flatten nested structures
List<List<Integer>> nested = List.of(List.of(1, 2), List.of(3, 4));
nested.stream()
    .flatMap(List::stream)        // 1, 2, 3, 4

// distinct - remove duplicates
Stream.of(1, 2, 2, 3, 3, 3)
    .distinct()                   // 1, 2, 3

// sorted
words.stream().sorted()           // Natural order
words.stream().sorted(Comparator.comparing(String::length))

// limit / skip
Stream.iterate(1, n -> n + 1)
    .skip(5)                      // Skip first 5
    .limit(10)                    // Take next 10

// peek - inspect elements (debugging)
words.stream()
    .peek(s -> System.out.println("Processing: " + s))
    .map(String::toUpperCase)
    .toList();

// takeWhile / dropWhile (Java 9+)
IntStream.range(1, 10)
    .takeWhile(n -> n < 5)        // 1, 2, 3, 4
IntStream.range(1, 10)
    .dropWhile(n -> n < 5)        // 5, 6, 7, 8, 9
```

### 9.3 Terminal Operations

Produce a result or side effect (triggers execution).

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5);

// forEach - execute action for each element
numbers.stream().forEach(System.out::println);

// count
long count = numbers.stream().count();  // 5

// collect - gather into collection
List<String> list = words.stream().collect(Collectors.toList());
Set<String> set = words.stream().collect(Collectors.toSet());
List<String> toList = words.stream().toList();  // Java 16+, unmodifiable

// reduce - combine elements
Optional<Integer> sum = numbers.stream().reduce((a, b) -> a + b);
int sumWithIdentity = numbers.stream().reduce(0, Integer::sum);

// min / max
Optional<Integer> min = numbers.stream().min(Integer::compareTo);
Optional<Integer> max = numbers.stream().max(Integer::compareTo);

// findFirst / findAny
Optional<Integer> first = numbers.stream().filter(n -> n > 3).findFirst();
Optional<Integer> any = numbers.parallelStream().filter(n -> n > 3).findAny();

// allMatch / anyMatch / noneMatch
boolean allPositive = numbers.stream().allMatch(n -> n > 0);      // true
boolean anyGreaterThan4 = numbers.stream().anyMatch(n -> n > 4);  // true
boolean noneNegative = numbers.stream().noneMatch(n -> n < 0);    // true

// toArray
Integer[] array = numbers.stream().toArray(Integer[]::new);
```

### 9.4 Collectors

Advanced collection operations.

```java
List<Person> people = List.of(
    new Person("Alice", 25, "Engineering"),
    new Person("Bob", 30, "Marketing"),
    new Person("Charlie", 25, "Engineering")
);

// toList, toSet, toCollection
List<String> names = people.stream()
    .map(Person::getName)
    .collect(Collectors.toList());

Set<String> departments = people.stream()
    .map(Person::getDepartment)
    .collect(Collectors.toSet());

TreeSet<String> sorted = people.stream()
    .map(Person::getName)
    .collect(Collectors.toCollection(TreeSet::new));

// toMap
Map<String, Integer> nameToAge = people.stream()
    .collect(Collectors.toMap(
        Person::getName,
        Person::getAge
    ));

// Handle duplicate keys
Map<String, Integer> nameToAge2 = people.stream()
    .collect(Collectors.toMap(
        Person::getName,
        Person::getAge,
        (existing, replacement) -> existing  // Merge function
    ));

// groupingBy
Map<String, List<Person>> byDept = people.stream()
    .collect(Collectors.groupingBy(Person::getDepartment));
// {"Engineering": [Alice, Charlie], "Marketing": [Bob]}

Map<String, Long> countByDept = people.stream()
    .collect(Collectors.groupingBy(
        Person::getDepartment,
        Collectors.counting()
    ));

Map<String, Double> avgAgeByDept = people.stream()
    .collect(Collectors.groupingBy(
        Person::getDepartment,
        Collectors.averagingInt(Person::getAge)
    ));

// partitioningBy (predicate-based, creates 2 groups: true/false)
Map<Boolean, List<Person>> youngAndOld = people.stream()
    .collect(Collectors.partitioningBy(p -> p.getAge() < 30));

// joining
String namesCsv = people.stream()
    .map(Person::getName)
    .collect(Collectors.joining(", "));  // "Alice, Bob, Charlie"

String namesFormatted = people.stream()
    .map(Person::getName)
    .collect(Collectors.joining(", ", "[", "]"));  // "[Alice, Bob, Charlie]"

// summarizingInt/Long/Double
IntSummaryStatistics stats = people.stream()
    .collect(Collectors.summarizingInt(Person::getAge));
stats.getCount();   // 3
stats.getSum();     // 80
stats.getMin();     // 25
stats.getMax();     // 30
stats.getAverage(); // 26.67

// reducing
Optional<Person> oldest = people.stream()
    .collect(Collectors.reducing((p1, p2) -> 
        p1.getAge() > p2.getAge() ? p1 : p2));

// mapping + downstream collector
Map<String, List<String>> namesByDept = people.stream()
    .collect(Collectors.groupingBy(
        Person::getDepartment,
        Collectors.mapping(Person::getName, Collectors.toList())
    ));
```

### 9.5 Parallel Streams

```java
// Creating parallel stream
List<Integer> numbers = IntStream.range(0, 1000000).boxed().toList();

long count = numbers.parallelStream()
    .filter(n -> isPrime(n))
    .count();

// Convert existing stream to parallel
numbers.stream()
    .parallel()
    .map(this::expensiveOperation)
    .toList();

// When to use parallel streams:
// ✓ Large data sets (10,000+ elements)
// ✓ CPU-intensive operations
// ✓ Independent element processing
// ✓ No shared mutable state

// When NOT to use:
// ✗ Small data sets (overhead > benefit)
// ✗ I/O bound operations
// ✗ Order-dependent operations
// ✗ Shared mutable state (race conditions)

// Parallel-safe operations
numbers.parallelStream()
    .reduce(0, Integer::sum);  // OK

// NOT parallel-safe (shared mutable state)
List<Integer> results = new ArrayList<>();
numbers.parallelStream()
    .forEach(results::add);  // Race condition!

// Fix: use collect
List<Integer> results = numbers.parallelStream()
    .collect(Collectors.toList());
```

---

## 10. Concurrency & Multithreading

Concurrency is one of Java's strongest features, but also one of the most challenging to master. Modern applications need to handle multiple tasks simultaneously - processing user requests, fetching data from APIs, updating databases. Understanding threads and concurrent programming is essential for building responsive, high-performance applications.

### 10.1 Creating Threads

A thread is the smallest unit of execution within a process. Your Java application starts with one thread (the main thread), but you can create additional threads to perform work concurrently. Think of threads as workers in a factory - multiple workers can accomplish more than one, but they need to coordinate to avoid stepping on each other's toes.

There are three ways to create threads in Java:

```java
// Method 1: Extend Thread
// Simple but inflexible - you can't extend another class
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Running in: " + Thread.currentThread().getName());
    }
}

MyThread thread = new MyThread();
thread.start();  // Don't call run() directly! start() creates new thread, run() just calls method

// Method 2: Implement Runnable (preferred - allows extending other classes)
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Running in: " + Thread.currentThread().getName());
    }
}

Thread thread = new Thread(new MyRunnable());
thread.start();

// Method 3: Lambda (preferred for simple tasks)
Thread thread = new Thread(() -> {
    System.out.println("Running in: " + Thread.currentThread().getName());
});
thread.start();

// Thread lifecycle:
// NEW:            Thread created but not started
// RUNNABLE:       Ready to run, waiting for CPU time
// RUNNING:        Currently executing (subset of RUNNABLE)
// BLOCKED:        Waiting to acquire a lock
// WAITING:        Waiting indefinitely (wait(), join())
// TIMED_WAITING:  Waiting with timeout (sleep(), wait(timeout))
// TERMINATED:     Finished execution
```

**Important:** Always call `start()`, never `run()`. Calling `run()` directly executes the code in the current thread - no new thread is created. `start()` creates a new thread and then calls `run()` in that new thread.

### 10.2 Thread Control

Once threads are running, you need ways to control them - pause execution, wait for completion, or request them to stop gracefully.

```java
// Sleep - pause the current thread
// Useful for polling, rate limiting, or simulating delays
Thread.sleep(1000);  // Pause for 1 second (throws InterruptedException)

// Join - wait for another thread to complete
// Essential when you need results from another thread before continuing
Thread thread = new Thread(() -> longRunningTask());
thread.start();
thread.join();        // Wait indefinitely
thread.join(5000);    // Wait max 5 seconds (returns even if thread not done)

// Interrupt - cooperative thread cancellation
// Java threads can't be forcibly killed - they must check for interruption
Thread thread = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        // Do work
    }
});
thread.start();
thread.interrupt();  // Sets the interrupted flag - thread must check it!

// Handling interrupts properly
// When InterruptedException is caught, the interrupted flag is cleared
// Best practice: restore the flag so callers know interruption was requested
try {
    Thread.sleep(10000);
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();  // Restore interrupted status
    return;  // Exit gracefully
}

// Daemon threads (die when all non-daemon threads finish)
Thread daemon = new Thread(() -> {
    while (true) {
        // Background work
    }
});
daemon.setDaemon(true);
daemon.start();
```

### 10.3 Synchronization

When multiple threads access shared data, you get race conditions - unpredictable results depending on thread timing. Synchronization ensures only one thread can access critical sections at a time, making operations atomic (all-or-nothing).

**The problem without synchronization:**
```
Thread 1: read count (0)
Thread 2: read count (0)
Thread 1: increment to 1
Thread 2: increment to 1  ← Lost update! Should be 2
Thread 1: write count (1)
Thread 2: write count (1)
```

**Solution: synchronized keyword**

```java
// synchronized method - locks on 'this' object
public class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;  // Only one thread at a time
    }
    
    public synchronized int getCount() {
        return count;
    }
}

// synchronized block - more granular, better performance
// Lock only the critical section, not the entire method
public class BankAccount {
    private double balance;
    private final Object lock = new Object();  // Dedicated lock object
    
    public void transfer(BankAccount target, double amount) {
        synchronized (lock) {  // Only this block is locked
            if (balance >= amount) {
                balance -= amount;
                target.deposit(amount);
            }
        }
    }
}

// DEADLOCK: Two threads waiting for each other's locks
// Thread 1: holds lock1, waiting for lock2
// Thread 2: holds lock2, waiting for lock1
// Neither can proceed - deadlock!

// Avoid deadlock by always acquiring locks in consistent order
synchronized (lock1) {
    synchronized (lock2) {
        // If ALL code acquires lock1 before lock2, no deadlock
    }
}

// wait/notify - inter-thread communication
// wait(): release lock and sleep until notified
// notify(): wake up ONE waiting thread
// notifyAll(): wake up ALL waiting threads (usually preferred)
public class BlockingQueue<T> {
    private final Queue<T> queue = new LinkedList<>();
    private final int capacity;
    
    public synchronized void put(T item) throws InterruptedException {
        while (queue.size() == capacity) {
            wait();  // Release lock and wait
        }
        queue.add(item);
        notifyAll();  // Wake up waiting consumers
    }
    
    public synchronized T take() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        T item = queue.remove();
        notifyAll();  // Wake up waiting producers
        return item;
    }
}
```

### 10.4 Locks (java.util.concurrent.locks)

The `synchronized` keyword is simple but limited. The Lock interface provides more flexibility: try-lock with timeout, interruptible locking, fairness policies, and multiple condition variables.

```java
// ReentrantLock - explicit locking
// "Reentrant" means the same thread can acquire it multiple times
private final ReentrantLock lock = new ReentrantLock();

public void doSomething() {
    lock.lock();
    try {
        // Critical section
    } finally {
        lock.unlock();  // Always unlock in finally!
    }
}

// tryLock - attempt to acquire without blocking indefinitely
// Great for avoiding deadlocks and implementing timeouts
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        // Got the lock
    } finally {
        lock.unlock();
    }
} else {
    // Couldn't acquire lock
}

// ReadWriteLock - optimizes for read-heavy workloads
// Multiple threads can read simultaneously (no data corruption risk)
// But writing requires exclusive access
private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
private final Lock readLock = rwLock.readLock();
private final Lock writeLock = rwLock.writeLock();

public String read() {
    readLock.lock();  // Multiple threads can read
    try {
        return data;
    } finally {
        readLock.unlock();
    }
}

public void write(String value) {
    writeLock.lock();  // Only one thread can write
    try {
        data = value;
    } finally {
        writeLock.unlock();
    }
}

// StampedLock (optimistic reading) - Java 8+
// Even faster for reads: assume no writer, validate later
// If validation fails, fall back to regular read lock
private final StampedLock sl = new StampedLock();

public double readOptimistic() {
    long stamp = sl.tryOptimisticRead();
    double value = this.value;
    if (!sl.validate(stamp)) {
        stamp = sl.readLock();
        try {
            value = this.value;
        } finally {
            sl.unlockRead(stamp);
        }
    }
    return value;
}
```

### 10.5 Atomic Classes

Atomic classes provide thread-safe operations without explicit locking. They use CPU-level atomic instructions (Compare-And-Swap) which are much faster than locks for simple operations like incrementing a counter.

```java
import java.util.concurrent.atomic.*;

// AtomicInteger - lock-free thread-safe integer
// Perfect for counters, sequence generators, statistics
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();     // ++counter, returns new value
counter.getAndIncrement();     // counter++, returns old value
counter.addAndGet(5);          // counter += 5
counter.compareAndSet(5, 10);  // Set to 10 if currently 5
counter.updateAndGet(n -> n * 2);  // Apply function atomically

// compareAndSet is the foundation - only updates if current value matches expected
// Enables lock-free algorithms (optimistic concurrency)

// Other atomic types
AtomicLong atomicLong = new AtomicLong();
AtomicBoolean atomicBoolean = new AtomicBoolean();
AtomicReference<String> atomicRef = new AtomicReference<>("initial");

// AtomicIntegerArray
AtomicIntegerArray array = new AtomicIntegerArray(10);
array.incrementAndGet(0);  // Increment element at index 0

// LongAdder - better than AtomicLong for high contention
// Instead of one counter, maintains multiple cells to reduce contention
// sum() aggregates all cells - slightly slower but add() is much faster
LongAdder adder = new LongAdder();
adder.increment();
adder.add(10);
long sum = adder.sum();  // Get total (reads all cells)
```

### 10.6 ExecutorService

Creating threads is expensive - each thread consumes memory for its stack and OS resources. ExecutorService manages a pool of reusable threads, dramatically improving performance when handling many tasks.

Think of it like a restaurant: instead of hiring a new waiter for each customer and firing them afterward, you maintain a staff of waiters who serve multiple customers throughout the day.

```java
// Fixed thread pool - best for known, bounded workloads
// Creates exactly N threads that are reused
ExecutorService executor = Executors.newFixedThreadPool(4);

// Submit tasks
executor.submit(() -> doTask());  // Runnable - fire and forget
Future<String> future = executor.submit(() -> "result");  // Callable - returns result

// Get result (blocks until task completes)
// Be careful - this defeats the purpose of async if called immediately!
String result = future.get();  // Blocks indefinitely
String result2 = future.get(5, TimeUnit.SECONDS);  // Throws TimeoutException if not done

// Batch execution
List<Callable<String>> tasks = List.of(
    () -> "task1",
    () -> "task2",
    () -> "task3"
);
List<Future<String>> futures = executor.invokeAll(tasks);
String first = executor.invokeAny(tasks);  // Returns first completed, cancels others

// Shutdown - ALWAYS shut down executors when done!
// Otherwise threads keep running and JVM won't exit
executor.shutdown();                 // Graceful, wait for tasks
executor.shutdownNow();              // Interrupt running tasks
executor.awaitTermination(60, TimeUnit.SECONDS);

// Thread pool types - choose based on your workload
Executors.newSingleThreadExecutor();    // Sequential execution, guarantees order
Executors.newCachedThreadPool();        // Grows/shrinks based on load (careful with unbounded!)
Executors.newScheduledThreadPool(4);    // For delayed/periodic tasks
Executors.newWorkStealingPool();        // ForkJoinPool - good for recursive/divide-conquer

// Scheduled tasks
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
scheduler.schedule(() -> task(), 5, TimeUnit.SECONDS);  // Run after 5s
scheduler.scheduleAtFixedRate(() -> task(), 0, 1, TimeUnit.SECONDS);  // Every 1s
scheduler.scheduleWithFixedDelay(() -> task(), 0, 1, TimeUnit.SECONDS);  // 1s AFTER previous completion
```

### 10.7 CompletableFuture

CompletableFuture is Java's answer to callback hell and blocking futures. It enables composing asynchronous operations in a readable, declarative way. Think of it as promises in JavaScript, but with more power.

Instead of:
```java
Future<User> userFuture = executor.submit(() -> fetchUser(id));
User user = userFuture.get();  // Blocks!
Future<Orders> ordersFuture = executor.submit(() -> fetchOrders(user));
Orders orders = ordersFuture.get();  // Blocks again!
```

You can write non-blocking chains:

```java
// Create CompletableFuture
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> 
    fetchData()  // Runs in ForkJoinPool.commonPool()
);

// With custom executor
CompletableFuture<String> future = CompletableFuture.supplyAsync(
    () -> fetchData(),
    customExecutor
);

// Transforming results - thenApply is like map()
CompletableFuture<Integer> lengthFuture = future
    .thenApply(String::length);  // When future completes, transform result

// Chaining async operations - thenCompose is like flatMap()
// Use when each step returns another CompletableFuture
CompletableFuture<String> result = getUserId()
    .thenCompose(id -> fetchUser(id))    // fetchUser returns CompletableFuture
    .thenCompose(user -> fetchOrders(user));  // Flattens nested futures

// Combining independent futures - run in parallel, combine results
CompletableFuture<String> combined = future1.thenCombine(
    future2,
    (result1, result2) -> result1 + result2  // Called when BOTH complete
);

// Either/any completion
CompletableFuture<String> fastest = future1.applyToEither(
    future2,
    Function.identity()  // Return whichever completes first
);

// All futures complete - fan-out pattern
CompletableFuture<Void> all = CompletableFuture.allOf(future1, future2, future3);
all.join();  // Block until all complete (Void because types might differ)

// Exception handling - graceful degradation
CompletableFuture<String> handled = future
    .exceptionally(ex -> "default")  // Recover from exceptions
    .handle((result, ex) -> {         // Handle both success and failure
        if (ex != null) return "error";
        return result;
    });

// Timeout (Java 9+) - don't wait forever
future.orTimeout(5, TimeUnit.SECONDS);  // Throws TimeoutException
future.completeOnTimeout("default", 5, TimeUnit.SECONDS);  // Returns default value

// Practical example: fetch user data in parallel
// Instead of 3 sequential calls (3x latency), run all at once
CompletableFuture<UserProfile> profile = CompletableFuture.allOf(
    fetchUserDetails(userId),
    fetchUserOrders(userId),
    fetchUserPreferences(userId)
).thenApply(v -> new UserProfile(
    detailsFuture.join(),
    ordersFuture.join(),
    prefsFuture.join()
));
```

### 10.8 Concurrent Collections

Regular collections like ArrayList and HashMap are NOT thread-safe. Concurrent modifications cause `ConcurrentModificationException` or data corruption. The `java.util.concurrent` package provides thread-safe alternatives designed for concurrent access.

```java
// ConcurrentHashMap - the workhorse of concurrent collections
// Unlike Collections.synchronizedMap(), allows concurrent reads AND writes
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
map.put("key", 1);
map.computeIfAbsent("key", k -> expensiveComputation());
map.compute("key", (k, v) -> v == null ? 1 : v + 1);  // Atomic update

// Bulk operations - can execute in parallel with threshold
map.forEach(1000, (k, v) -> process(k, v));  // Parallel if size > threshold
map.search(1000, (k, v) -> v > 100 ? k : null);
map.reduce(1000, (k, v) -> v, Integer::sum);

// CopyOnWriteArrayList - for read-heavy, write-rare scenarios
// Every write creates a new copy of the array (expensive!)
// But reads are lock-free and iteration never throws ConcurrentModificationException
List<String> cowList = new CopyOnWriteArrayList<>();
for (String item : cowList) {  // Iterates over snapshot
    cowList.add("new");  // Creates new array, doesn't affect current iteration
}

// BlockingQueue - the foundation of producer-consumer patterns
// Producers add tasks, consumers take them - coordination is automatic
BlockingQueue<Task> queue = new LinkedBlockingQueue<>(100);  // Bounded queue
queue.put(task);              // Blocks if full
queue.take();                 // Blocks if empty
queue.offer(task, 1, TimeUnit.SECONDS);  // With timeout
queue.poll(1, TimeUnit.SECONDS);

// Other blocking queues - choose based on your needs
ArrayBlockingQueue<T>        // Fixed size, fair option available
PriorityBlockingQueue<T>     // Elements sorted by priority
DelayQueue<T>                // Elements become available after a delay
SynchronousQueue<T>          // Zero capacity - direct producer-to-consumer handoff

// ConcurrentSkipListMap - sorted concurrent map
ConcurrentSkipListMap<String, Integer> sortedMap = new ConcurrentSkipListMap<>();
```

### 10.9 Virtual Threads (Java 21+)

Traditional platform threads are expensive - each consumes ~1MB of memory for its stack and requires OS kernel involvement for scheduling. This limits you to thousands of threads at most.

Virtual threads are lightweight threads managed by the JVM, not the OS. You can create millions of them! They're perfect for I/O-bound tasks where threads spend most of their time waiting.

```java
// Create virtual thread
Thread vt = Thread.startVirtualThread(() -> doTask());

// Using Thread.ofVirtual()
Thread.ofVirtual().start(() -> doTask());  // Builder pattern

// Virtual thread executor - one virtual thread per task
// Can handle thousands/millions of concurrent tasks
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i ->
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        })
    );
}

// Key characteristics:
// - Lightweight: ~1KB vs ~1MB for platform threads
// - Cheap to create: no OS thread allocation
// - Ideal for I/O-bound tasks: waiting for network, database, files
// - NOT faster for CPU-bound work: still limited by CPU cores
// - Write blocking code that scales like async!

// Structured concurrency (Preview) - cleaner async patterns
// Subtasks are bound to parent scope - no orphaned threads
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Future<User> user = scope.fork(() -> fetchUser(id));
    Future<List<Order>> orders = scope.fork(() -> fetchOrders(id));
    
    scope.join();           // Wait for all
    scope.throwIfFailed();  // Propagate exceptions
    
    return new Response(user.resultNow(), orders.resultNow());
}
```

---

## 11. Memory Management & JVM

Understanding how Java manages memory is crucial for writing efficient applications and debugging memory issues. Unlike C/C++, Java handles memory allocation and deallocation automatically through the JVM and garbage collector. However, this doesn't mean you can ignore memory entirely - poor memory usage leads to performance problems and OutOfMemoryErrors.

### 11.1 Memory Areas

The JVM divides memory into several distinct regions, each serving a specific purpose:

```
┌─────────────────────────────────────────────────────────────┐
│                          JVM Memory                          │
├─────────────────┬───────────────────────────────────────────┤
│                 │  ┌─────────────────────────────────────┐  │
│    Heap         │  │  Young Generation                   │  │
│  (Objects)      │  │  ┌───────┐  ┌───────┐  ┌───────┐   │  │
│                 │  │  │ Eden  │  │  S0   │  │  S1   │   │  │
│                 │  │  └───────┘  └───────┘  └───────┘   │  │
│                 │  └─────────────────────────────────────┘  │
│                 │  ┌─────────────────────────────────────┐  │
│                 │  │  Old Generation (Tenured)           │  │
│                 │  └─────────────────────────────────────┘  │
├─────────────────┼───────────────────────────────────────────┤
│    Metaspace    │  Class metadata, method info              │
│    (Non-Heap)   │  (Replaced PermGen in Java 8)             │
├─────────────────┼───────────────────────────────────────────┤
│    Stack        │  Thread-local: local variables,           │
│  (Per Thread)   │  method calls, partial results            │
├─────────────────┼───────────────────────────────────────────┤
│    Native       │  Native method stacks, JNI                │
└─────────────────┴───────────────────────────────────────────┘
```

**Understanding the memory regions:**

- **Heap**: Where all objects live. When you `new` something, it goes here. Shared across all threads.
  - **Young Generation**: For new, short-lived objects. Most objects die young, so GC happens frequently here.
    - **Eden**: Where objects are initially allocated
    - **Survivor spaces (S0, S1)**: Objects that survive Eden GC move here temporarily
  - **Old Generation**: Objects that survive multiple Young GCs get promoted here. GC is less frequent but more expensive.

- **Metaspace**: Stores class definitions, method metadata. Replaced PermGen in Java 8 and can grow dynamically.

- **Stack**: One per thread. Stores local variables, method call information. Fast but limited in size.

- **Native Memory**: For JNI code, direct buffers, thread stacks.

### 11.2 Garbage Collection

Garbage collection automatically reclaims memory from objects that are no longer reachable. You don't need to (and can't) explicitly free memory in Java, but understanding GC helps you write applications that perform well.

```java
// Object becomes eligible for GC when:
// 1. No references point to it
// 2. Reference is nulled: obj = null
// 3. Reference is reassigned: obj = newObj
// 4. Object created in method, method returns
```

**Choosing a Garbage Collector:**

| GC | Best For | Trade-off |
|-----|----------|----------|
| Serial (`-XX:+UseSerialGC`) | Small heaps, single CPU | Stops application (STW) longer, but simple |
| Parallel (`-XX:+UseParallelGC`) | Throughput-focused batch jobs | Higher throughput, but longer pauses |
| G1 (`-XX:+UseG1GC`) | Default since Java 9, balanced | Good latency/throughput balance |
| ZGC (`-XX:+UseZGC`) | Large heaps (TB), low latency | <10ms pauses even with huge heaps |
| Shenandoah (`-XX:+UseShenandoahGC`) | Low latency alternative | Concurrent collection, low pauses |

```java
// Requesting GC - NO GUARANTEE it will run!
// Avoid in production - let JVM decide
System.gc();  // Hint to JVM, usually ignored

// finalize() - DEPRECATED since Java 9
// Problems: unpredictable timing, performance overhead, resurrection issues
// Use try-with-resources for cleanup instead!

// Reference types - control when objects can be collected
// Strong: Object obj = new Object();       // Normal - prevents GC
// Soft:   SoftReference<Object> soft;      // GC'd when memory is low (good for caches)
// Weak:   WeakReference<Object> weak;      // GC'd at any collection (good for mappings)
// Phantom: PhantomReference<Object> ph;    // For post-mortem cleanup actions

WeakReference<BigObject> weakRef = new WeakReference<>(new BigObject());
BigObject obj = weakRef.get();  // May return null if collected

// WeakHashMap - keys can be garbage collected
// Perfect for caches where key presence shouldn't prevent GC
WeakHashMap<Key, Value> cache = new WeakHashMap<>();
```

### 11.3 JVM Options

Tuning JVM options is essential for production applications. The defaults work for development, but production workloads often need adjustments based on your application's memory profile and latency requirements.

```bash
# Memory settings - start here
-Xms512m          # Initial heap size
-Xmx2g            # Maximum heap size
-Xss256k          # Thread stack size
-XX:MetaspaceSize=256m
-XX:MaxMetaspaceSize=512m

# GC selection
-XX:+UseG1GC
-XX:+UseZGC
-XX:+UseShenandoahGC

# GC tuning
-XX:NewRatio=2              # Old/Young ratio
-XX:SurvivorRatio=8         # Eden/Survivor ratio
-XX:MaxGCPauseMillis=200    # Target pause time
-XX:G1HeapRegionSize=16m

# GC logging
-Xlog:gc*:file=gc.log:time,uptime:filecount=5,filesize=10m

# Debugging
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/tmp/heap.hprof
-XX:+PrintFlagsFinal         # Print all JVM flags

# Performance
-XX:+UseStringDeduplication  # Deduplicate String in G1
-XX:+UseCompressedOops       # Compress object pointers
```

### 11.4 Memory Leaks

Even with garbage collection, memory leaks happen in Java. A memory leak occurs when objects that are no longer needed remain reachable, preventing the GC from reclaiming them. Over time, the heap fills up and you get OutOfMemoryError.

```java
// Common causes of memory leaks:

// 1. Static collections that grow forever
public class Cache {
    private static final Map<String, Object> cache = new HashMap<>();
    
    public void add(String key, Object value) {
        cache.put(key, value);  // Never removed!
    }
}

// 2. Unclosed resources
public void readFile(String path) throws IOException {
    FileInputStream fis = new FileInputStream(path);
    // If exception occurs, stream never closed
}
// Fix: use try-with-resources

// 3. Listeners/callbacks not removed
button.addActionListener(this);
// Must remove: button.removeActionListener(this);

// 4. Inner class holding reference to outer
public class Outer {
    private byte[] largeData = new byte[1024 * 1024];
    
    public Runnable createRunnable() {
        return new Runnable() {
            @Override
            public void run() {
                // Holds reference to Outer (and largeData)
            }
        };
    }
}
// Fix: use static inner class or lambda

// 5. ThreadLocal not cleaned up
private static ThreadLocal<Connection> connHolder = new ThreadLocal<>();

public void process() {
    connHolder.set(getConnection());
    // ... do work
    // Must clean up!
    connHolder.remove();  // In finally block
}

// Detecting leaks - tools and commands
// jmap -histo <pid>                     # See object counts by class
// jcmd <pid> GC.heap_dump filename.hprof  # Dump heap for analysis
// Memory profilers: VisualVM (free), JProfiler, YourKit, Eclipse MAT
```

---

## 12. Modern Java Features (Java 17+)

Java has evolved significantly in recent years with a predictable 6-month release cycle. These modern features dramatically improve code readability and reduce boilerplate. If you're still writing Java 8-style code, you're working harder than you need to.

### 12.1 Pattern Matching

Pattern matching eliminates tedious type checking and casting. Instead of checking a type and then casting, you do both in one expression. The variable is automatically scoped to where it's valid.

```java
// instanceof pattern matching (Java 16+)
Object obj = "Hello";

// Old way
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}

// New way
if (obj instanceof String s) {
    System.out.println(s.length());
}

// Pattern matching in switch (Java 21+)
// Combines type patterns with switch expressions - extremely powerful
String describe(Object obj) {
    return switch (obj) {
        case Integer i -> "Integer: " + i;
        case String s -> "String of length " + s.length();
        case Double d -> "Double: " + d;
        case null -> "null";
        default -> "Unknown: " + obj.getClass();
    };
}

// Guarded patterns - add conditions with 'when'
// Evaluated top-to-bottom, first match wins
String process(Object obj) {
    return switch (obj) {
        case String s when s.isEmpty() -> "Empty string";
        case String s when s.length() > 10 -> "Long string: " + s;
        case String s -> "String: " + s;
        case Integer i when i > 0 -> "Positive: " + i;
        case Integer i when i < 0 -> "Negative: " + i;
        case Integer i -> "Zero";
        default -> "Other";
    };
}

// Record patterns (Java 21+) - destructure records directly in patterns
record Point(int x, int y) {}
record ColoredPoint(Point p, String color) {}

void printSum(Object obj) {
    if (obj instanceof Point(int x, int y)) {
        System.out.println("Sum: " + (x + y));
    }
    
    if (obj instanceof ColoredPoint(Point(int x, int y), String c)) {
        System.out.println("Colored point at (" + x + "," + y + ") in " + c);
    }
}
```

### 12.2 Text Blocks (Java 15+)

Text blocks are multi-line string literals that preserve formatting. No more concatenating strings with `+` or using `\n` everywhere. Perfect for JSON, HTML, SQL, or any embedded text.

```java
// Multi-line strings with proper indentation
// The compiler strips common leading whitespace automatically
String json = """
    {
        "name": "Alice",
        "age": 25,
        "city": "New York"
    }
    """;

// Incidental whitespace (removed based on closing quotes position)
String html = """
        <html>
            <body>
                <p>Hello</p>
            </body>
        </html>
        """;  // Closing quotes determine base indentation

// Escape sequences
String with = """
    Line 1\
    continues on same line
    Line 2 ends here
    """;

// String methods for text blocks
String stripped = textBlock.stripIndent();
String translated = textBlock.translateEscapes();  // Process escape sequences

// Formatted text block - combine with String.formatted()
String template = """
    Hello %s,
    Your balance is $%.2f
    """.formatted(name, balance);
```

### 12.3 Helpful NullPointerExceptions (Java 14+)

Before Java 14, NPEs just said "NullPointerException" with no context. Now the JVM tells you exactly which part of the expression was null - a huge debugging improvement.

```java
// Before: "NullPointerException"
// After: "Cannot invoke String.toLowerCase() because the return value of Person.getName() is null"

Person person = new Person(null, null);
String lower = person.getName().toLowerCase();  // Detailed message!

// Enable explicitly (default in Java 15+)
// java -XX:+ShowCodeDetailsInExceptionMessages
```

### 12.4 Other Modern Features

Java continues to add features that reduce boilerplate and improve expressiveness:

```java
// Compact record constructors (Java 16+)
// Validation without repeating field assignments
public record Range(int start, int end) {
    public Range {
        if (start > end) {
            throw new IllegalArgumentException("start > end");
        }
    }
}

// Sequenced Collections (Java 21+)
// Finally! First/last element access standardized across List, Set, Map
SequencedCollection<String> seq = new ArrayList<>();
seq.addFirst("first");
seq.addLast("last");
seq.getFirst();
seq.getLast();
seq.reversed();  // Reversed view

SequencedMap<String, Integer> seqMap = new LinkedHashMap<>();
seqMap.firstEntry();
seqMap.lastEntry();
seqMap.putFirst("key", 1);
seqMap.reversed();

// String templates (Preview in Java 21)
// String msg = STR."Hello \{name}, you have \{count} messages";

// Unnamed patterns and variables (Java 22+)
// Use _ when you don't need the variable - signals intentional disuse
try {
    // ...
} catch (Exception _) {  // Unnamed, we don't need the exception
    log.error("Failed");
}

// in pattern matching
if (obj instanceof Point(int x, _)) {
    // Only care about x
}

// Unnamed classes and main (Preview, Java 21+)
// Simplifies writing small programs
void main() {
    System.out.println("Hello!");
}
```

---

## 13. Best Practices & Design Patterns

These practices aren't just academic - they're distilled from decades of Java development experience. Following them makes your code more maintainable, testable, and less prone to bugs.

### 13.1 Code Quality

```java
// 1. Follow naming conventions - makes code readable without comments
class UserService { }           // PascalCase for classes
void calculateTotal() { }       // camelCase for methods
final int MAX_RETRIES = 3;      // SCREAMING_SNAKE_CASE for constants
private String userName;        // camelCase for variables

// 2. Prefer immutability
public final class Money {
    private final BigDecimal amount;
    private final Currency currency;
    
    // No setters, only getters
    // Returns new instance for operations
    public Money add(Money other) {
        return new Money(amount.add(other.amount), currency);
    }
}

// 3. Use Optional instead of null
public Optional<User> findById(Long id) {
    return Optional.ofNullable(repository.find(id));
}

// 4. Fail fast
public void process(String data) {
    Objects.requireNonNull(data, "data cannot be null");
    if (data.isEmpty()) {
        throw new IllegalArgumentException("data cannot be empty");
    }
    // Continue processing
}

// 5. Use try-with-resources
try (var reader = new BufferedReader(new FileReader(path))) {
    // Auto-closed
}

// 6. Prefer composition over inheritance
public class OrderProcessor {
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    
    // Compose behavior
}

// 7. Write defensive copies
public class Period {
    private final Date start;
    private final Date end;
    
    public Period(Date start, Date end) {
        this.start = new Date(start.getTime());  // Defensive copy
        this.end = new Date(end.getTime());
    }
    
    public Date getStart() {
        return new Date(start.getTime());  // Return copy
    }
}
```

### 13.2 Common Design Patterns

Design patterns are proven solutions to common problems. Don't force them everywhere, but recognize when they naturally fit.

**Singleton:** One instance for the entire application (use sparingly - often a code smell)

```java
// Thread-safe singleton with enum
public enum Singleton {
    INSTANCE;
    
    public void doSomething() { }
}

// Or with static holder
public class Singleton {
    private Singleton() { }
    
    private static class Holder {
        static final Singleton INSTANCE = new Singleton();
    }
    
    public static Singleton getInstance() {
        return Holder.INSTANCE;
    }
}
```

**Builder:** Construct complex objects step-by-step. Essential when you have many optional parameters.

```java
public class User {
    private final String name;
    private final String email;
    private final int age;
    
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
    }
    
    public static class Builder {
        private String name;
        private String email;
        private int age;
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

User user = new User.Builder()
    .name("Alice")
    .email("alice@example.com")
    .age(25)
    .build();
```

**Factory:** Create objects without specifying exact classes. Decouples object creation from usage.

```java
public interface Shape {
    void draw();
}

public class ShapeFactory {
    public static Shape create(String type) {
        return switch (type.toUpperCase()) {
            case "CIRCLE" -> new Circle();
            case "RECTANGLE" -> new Rectangle();
            case "TRIANGLE" -> new Triangle();
            default -> throw new IllegalArgumentException("Unknown: " + type);
        };
    }
}
```

**Strategy:** Define a family of algorithms, make them interchangeable. With lambdas, this pattern becomes trivial.

```java
// Using functional interface
@FunctionalInterface
public interface PricingStrategy {
    BigDecimal calculatePrice(BigDecimal basePrice);
}

public class Order {
    public BigDecimal calculateTotal(PricingStrategy strategy) {
        return strategy.calculatePrice(basePrice);
    }
}

// Usage with lambdas
order.calculateTotal(price -> price);  // No discount
order.calculateTotal(price -> price.multiply(new BigDecimal("0.9")));  // 10% off
order.calculateTotal(price -> price.subtract(new BigDecimal("10")));  // $10 off
```

**Observer:** Publish-subscribe pattern for event-driven architectures.

```java
// Using java.util.function
public class EventEmitter<T> {
    private final List<Consumer<T>> listeners = new CopyOnWriteArrayList<>();
    
    public void subscribe(Consumer<T> listener) {
        listeners.add(listener);
    }
    
    public void unsubscribe(Consumer<T> listener) {
        listeners.remove(listener);
    }
    
    public void emit(T event) {
        listeners.forEach(listener -> listener.accept(event));
    }
}

EventEmitter<String> emitter = new EventEmitter<>();
emitter.subscribe(msg -> System.out.println("Received: " + msg));
emitter.emit("Hello!");
```

### 13.3 SOLID Principles

SOLID is an acronym for five principles that make object-oriented code more maintainable, flexible, and understandable. These aren't rules - they're guidelines that help you make better design decisions.

```java
// Single Responsibility - A class should have only one reason to change
// Bad: UserService handles auth, validation, and notifications
// Good: Separate AuthService, ValidationService, NotificationService

// Open/Closed - open for extension, closed for modification
public interface DiscountCalculator {
    BigDecimal calculate(Order order);
}

public class PercentageDiscount implements DiscountCalculator {
    private final BigDecimal percentage;
    // Implementation
}

public class FixedDiscount implements DiscountCalculator {
    private final BigDecimal amount;
    // Implementation
}

// Liskov Substitution - subtypes must be substitutable
// Bad: Square extends Rectangle but breaks setWidth/setHeight contract
// Good: Both implement Shape interface

// Interface Segregation - clients shouldn't depend on unused methods
// Bad: One fat interface
// Good: Small, focused interfaces
interface Readable { byte[] read(); }
interface Writable { void write(byte[] data); }
interface Seekable { void seek(long position); }

// Dependency Inversion - depend on abstractions
public class OrderService {
    private final PaymentGateway paymentGateway;  // Interface, not impl
    
    public OrderService(PaymentGateway paymentGateway) {
        this.paymentGateway = paymentGateway;  // Injected dependency
    }
}
```

---

## Conclusion

This guide covers Java from basics to advanced topics. Key takeaways:

1. **Master the fundamentals**: Data types, control flow, OOP concepts
2. **Understand memory**: How JVM manages memory, GC behavior
3. **Embrace modern Java**: Records, sealed classes, pattern matching
4. **Write concurrent code safely**: Use high-level utilities over raw threads
5. **Follow best practices**: SOLID principles, immutability, defensive coding

Continue learning with:
- Official Java documentation: https://docs.oracle.com/en/java/
- Java Language Specification (JLS)
- Effective Java by Joshua Bloch
- Java Concurrency in Practice by Brian Goetz
