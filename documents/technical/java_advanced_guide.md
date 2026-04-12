# Java Advanced Knowledge & Interview Guide

## Table of Contents
1. [Basic Knowledge](#1-basic-knowledge)
2. [OOP, Principles & SOLID](#2-oop-principles--solid)
3. [Spring Boot Framework](#3-spring-boot-framework)
4. [ORM (JPA & Hibernate)](#4-orm-jpa--hibernate)
5. [Testing Framework](#5-testing-framework)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Best Practices](#7-best-practices)
8. [Coding Conventions](#8-coding-conventions)
9. [Tools](#9-tools)

---

## 1. Basic Knowledge

### 1.1 Java Memory Model

```
┌─────────────────────────────────────────────────────────┐
│                      JVM Memory                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │   Method Area   │  │           Heap              │   │
│  │  (Class Data)   │  │  ┌───────┐  ┌───────────┐   │   │
│  │  - Metadata     │  │  │ Young │  │    Old    │   │   │
│  │  - Static vars  │  │  │  Gen  │  │    Gen    │   │   │
│  │  - Constants    │  │  └───────┘  └───────────┘   │   │
│  └─────────────────┘  └─────────────────────────────┘   │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │  Stack (per     │  │    Native Method Stack      │   │
│  │    thread)      │  │    (JNI calls)              │   │
│  │  - Local vars   │  │                             │   │
│  │  - Method calls │  │                             │   │
│  └─────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Concepts:**
- **Stack**: Thread-specific, stores primitives and references
- **Heap**: Shared memory for objects, managed by GC
- **Method Area**: Class metadata, static variables
- **Young Generation**: New objects (Eden, Survivor spaces)
- **Old Generation**: Long-lived objects

### 1.2 Garbage Collection

```java
// GC Algorithms
// 1. Serial GC - Single thread, stop-the-world
// 2. Parallel GC - Multiple threads, stop-the-world
// 3. G1 GC (default Java 9+) - Region-based, concurrent
// 4. ZGC - Low latency, concurrent

// GC Roots (objects that are NOT garbage collected)
// - Active threads
// - Static variables
// - Local variables in stack frames
// - JNI references

// Memory leak prevention
public class ResourceManager implements AutoCloseable {
    private Connection connection;
    
    @Override
    public void close() {
        if (connection != null) {
            connection.close();
        }
    }
}

// Using try-with-resources
try (ResourceManager rm = new ResourceManager()) {
    // Use resource
} // Automatically calls close()
```

### 1.3 Collections Framework

```java
// Collection Hierarchy
/*
Collection
├── List (ordered, duplicates allowed)
│   ├── ArrayList - O(1) random access, O(n) insert
│   ├── LinkedList - O(n) access, O(1) insert
│   └── Vector - Thread-safe (legacy)
├── Set (unique elements)
│   ├── HashSet - O(1) operations, no order
│   ├── LinkedHashSet - O(1), maintains insertion order
│   └── TreeSet - O(log n), sorted order
└── Queue
    ├── PriorityQueue - Heap-based, natural ordering
    ├── ArrayDeque - Double-ended queue
    └── LinkedList - Also implements Queue

Map (key-value pairs)
├── HashMap - O(1) operations, no order
├── LinkedHashMap - O(1), maintains insertion order
├── TreeMap - O(log n), sorted by keys
├── ConcurrentHashMap - Thread-safe
└── Hashtable - Thread-safe (legacy)
*/

// Thread-safe collections
import java.util.concurrent.*;

// ConcurrentHashMap - Lock striping for better concurrency
ConcurrentHashMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
concurrentMap.putIfAbsent("key", 1);
concurrentMap.computeIfPresent("key", (k, v) -> v + 1);

// CopyOnWriteArrayList - Best for read-heavy scenarios
CopyOnWriteArrayList<String> cowList = new CopyOnWriteArrayList<>();

// BlockingQueue - Producer-consumer pattern
BlockingQueue<Task> queue = new LinkedBlockingQueue<>(100);
queue.put(task);      // Blocks if full
queue.take();         // Blocks if empty
```

### 1.4 Generics

```java
// Generic class
public class Box<T> {
    private T content;
    
    public void set(T content) { this.content = content; }
    public T get() { return content; }
}

// Bounded type parameters
public class NumberBox<T extends Number> {
    public double sum(T a, T b) {
        return a.doubleValue() + b.doubleValue();
    }
}

// Wildcards
// ? extends T - Upper bound (read-only)
public void processNumbers(List<? extends Number> numbers) {
    for (Number n : numbers) {
        System.out.println(n.doubleValue());
    }
    // numbers.add(1); // Compile error! Can't add
}

// ? super T - Lower bound (write-only)
public void addIntegers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    // Integer i = list.get(0); // Compile error! Can only get Object
}

// PECS: Producer Extends, Consumer Super
public static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T item : src) {
        dest.add(item);
    }
}

// Type erasure - Generics are compile-time only
// At runtime: Box<String> and Box<Integer> are both just Box
```

### 1.5 Streams & Functional Programming

```java
// Stream operations
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// Filter, map, collect
List<String> filtered = names.stream()
    .filter(name -> name.length() > 3)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());

// Reduce
int sum = IntStream.rangeClosed(1, 100)
    .reduce(0, Integer::sum);

// Grouping
Map<Integer, List<String>> byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));

// Parallel streams (use carefully)
long count = names.parallelStream()
    .filter(name -> name.startsWith("A"))
    .count();

// Optional - Avoid NullPointerException
Optional<String> optional = Optional.ofNullable(getValue());
String result = optional
    .map(String::toUpperCase)
    .filter(s -> s.length() > 3)
    .orElse("default");

// Functional interfaces
@FunctionalInterface
public interface Transformer<T, R> {
    R transform(T input);
    
    // Can have default methods
    default <V> Transformer<T, V> andThen(Transformer<R, V> after) {
        return (T t) -> after.transform(this.transform(t));
    }
}
```

### 1.6 Concurrency

```java
// Thread creation
// 1. Extend Thread
class MyThread extends Thread {
    @Override
    public void run() { /* work */ }
}

// 2. Implement Runnable (preferred)
Runnable task = () -> System.out.println("Running");
new Thread(task).start();

// 3. Callable with Future
Callable<Integer> callable = () -> {
    Thread.sleep(1000);
    return 42;
};
ExecutorService executor = Executors.newFixedThreadPool(4);
Future<Integer> future = executor.submit(callable);
Integer result = future.get(); // Blocks until complete

// CompletableFuture (Java 8+)
CompletableFuture<String> cf = CompletableFuture
    .supplyAsync(() -> fetchData())
    .thenApply(data -> process(data))
    .thenApply(String::toUpperCase)
    .exceptionally(ex -> "Error: " + ex.getMessage());

// Combine multiple futures
CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> cf2 = CompletableFuture.supplyAsync(() -> "World");

CompletableFuture<String> combined = cf1.thenCombine(cf2, (s1, s2) -> s1 + " " + s2);

// Synchronization
public class Counter {
    private int count = 0;
    private final Object lock = new Object();
    
    // Method-level synchronization
    public synchronized void increment() {
        count++;
    }
    
    // Block-level synchronization
    public void incrementBlock() {
        synchronized (lock) {
            count++;
        }
    }
}

// Atomic classes
AtomicInteger atomicCount = new AtomicInteger(0);
atomicCount.incrementAndGet();
atomicCount.compareAndSet(5, 10);

// ReentrantLock - More flexible than synchronized
private final ReentrantLock lock = new ReentrantLock();

public void doWork() {
    lock.lock();
    try {
        // Critical section
    } finally {
        lock.unlock();
    }
}

// ReadWriteLock - Multiple readers, single writer
private final ReadWriteLock rwLock = new ReentrantReadWriteLock();

public String read() {
    rwLock.readLock().lock();
    try {
        return data;
    } finally {
        rwLock.readLock().unlock();
    }
}

public void write(String value) {
    rwLock.writeLock().lock();
    try {
        data = value;
    } finally {
        rwLock.writeLock().unlock();
    }
}
```

### Basic Knowledge Interview Questions

**Q1: What is the difference between == and .equals()?**

| Aspect | == | .equals() |
|--------|-----|-----------|
| Type | Operator | Method |
| Primitives | Compares values | N/A |
| Objects | Compares references | Compares content (if overridden) |
| null safety | Safe | Throws NPE if called on null |

```java
String s1 = new String("hello");
String s2 = new String("hello");
String s3 = "hello";
String s4 = "hello";

s1 == s2;      // false (different objects)
s1.equals(s2); // true (same content)
s3 == s4;      // true (string pool)
```

**Q2: What is the difference between HashMap and ConcurrentHashMap?**

| Aspect | HashMap | ConcurrentHashMap |
|--------|---------|-------------------|
| Thread-safe | NO | YES |
| Null keys | Allows 1 null key | NO nulls allowed |
| Null values | Allows null values | NO nulls allowed |
| Performance | Faster (single-thread) | Lock striping |
| Iteration | Fail-fast | Weakly consistent |

**Q3: Explain the volatile keyword**

```java
// volatile ensures:
// 1. Visibility - Changes are visible to all threads
// 2. Prevents instruction reordering

private volatile boolean running = true;

// Thread 1
public void stop() {
    running = false; // Immediately visible to Thread 2
}

// Thread 2
public void run() {
    while (running) { // Always reads fresh value
        // work
    }
}

// volatile does NOT provide atomicity!
private volatile int count = 0;
count++; // NOT atomic! (read-modify-write)
```

---

## 2. OOP, Principles & SOLID

### 2.1 Four Pillars of OOP

```java
// 1. ENCAPSULATION - Hide internal state
public class BankAccount {
    private double balance; // Hidden
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public double getBalance() {
        return balance;
    }
}

// 2. INHERITANCE - Reuse and extend
public class Animal {
    protected String name;
    
    public void eat() {
        System.out.println(name + " is eating");
    }
}

public class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println(name + " is eating dog food");
    }
    
    public void bark() {
        System.out.println("Woof!");
    }
}

// 3. POLYMORPHISM - Same interface, different behavior
public interface Shape {
    double area();
}

public class Circle implements Shape {
    private double radius;
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle implements Shape {
    private double width, height;
    
    @Override
    public double area() {
        return width * height;
    }
}

// Runtime polymorphism
Shape shape = new Circle(5);
shape.area(); // Calls Circle's area()

// 4. ABSTRACTION - Hide complexity
public abstract class Database {
    public abstract void connect();
    public abstract void query(String sql);
    
    // Template method
    public void executeTransaction(String sql) {
        connect();
        query(sql);
        close();
    }
    
    protected void close() {
        System.out.println("Closing connection");
    }
}
```

### 2.2 SOLID Principles

#### S - Single Responsibility Principle (SRP)

```java
// BAD - Class has multiple responsibilities
public class User {
    public void saveToDatabase() { /* ... */ }
    public void sendEmail() { /* ... */ }
    public void generateReport() { /* ... */ }
}

// GOOD - Each class has one responsibility
public class User {
    private String name;
    private String email;
    // Only user data and behavior
}

public class UserRepository {
    public void save(User user) { /* ... */ }
    public User findById(Long id) { /* ... */ }
}

public class EmailService {
    public void sendWelcomeEmail(User user) { /* ... */ }
}

public class ReportGenerator {
    public Report generateUserReport(User user) { /* ... */ }
}
```

#### O - Open/Closed Principle (OCP)

```java
// BAD - Must modify class to add new shapes
public class AreaCalculator {
    public double calculate(Object shape) {
        if (shape instanceof Circle) {
            Circle c = (Circle) shape;
            return Math.PI * c.radius * c.radius;
        } else if (shape instanceof Rectangle) {
            Rectangle r = (Rectangle) shape;
            return r.width * r.height;
        }
        // Must add new else-if for each shape!
        return 0;
    }
}

// GOOD - Open for extension, closed for modification
public interface Shape {
    double area();
}

public class Circle implements Shape {
    private double radius;
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public class Triangle implements Shape {
    private double base, height;
    
    @Override
    public double area() {
        return 0.5 * base * height;
    }
}

public class AreaCalculator {
    public double calculate(Shape shape) {
        return shape.area(); // Works for any Shape!
    }
}
```

#### L - Liskov Substitution Principle (LSP)

```java
// BAD - Square violates LSP for Rectangle
public class Rectangle {
    protected int width;
    protected int height;
    
    public void setWidth(int width) { this.width = width; }
    public void setHeight(int height) { this.height = height; }
    public int area() { return width * height; }
}

public class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        this.width = width;
        this.height = width; // Breaks expected behavior!
    }
    
    @Override
    public void setHeight(int height) {
        this.height = height;
        this.width = height;
    }
}

// This test fails for Square!
void testRectangle(Rectangle r) {
    r.setWidth(5);
    r.setHeight(10);
    assert r.area() == 50; // Square gives 100!
}

// GOOD - Use composition or separate interfaces
public interface Shape {
    int area();
}

public class Rectangle implements Shape {
    private final int width;
    private final int height;
    
    public Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public int area() { return width * height; }
}

public class Square implements Shape {
    private final int side;
    
    public Square(int side) {
        this.side = side;
    }
    
    @Override
    public int area() { return side * side; }
}
```

#### I - Interface Segregation Principle (ISP)

```java
// BAD - Fat interface forces unnecessary implementations
public interface Worker {
    void work();
    void eat();
    void sleep();
}

public class Robot implements Worker {
    @Override
    public void work() { /* ... */ }
    
    @Override
    public void eat() { /* Robots don't eat! */ }
    
    @Override
    public void sleep() { /* Robots don't sleep! */ }
}

// GOOD - Segregated interfaces
public interface Workable {
    void work();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

public class Human implements Workable, Eatable, Sleepable {
    @Override
    public void work() { /* ... */ }
    
    @Override
    public void eat() { /* ... */ }
    
    @Override
    public void sleep() { /* ... */ }
}

public class Robot implements Workable {
    @Override
    public void work() { /* ... */ }
}
```

#### D - Dependency Inversion Principle (DIP)

```java
// BAD - High-level module depends on low-level module
public class MySQLDatabase {
    public void save(String data) { /* ... */ }
}

public class UserService {
    private MySQLDatabase database = new MySQLDatabase(); // Tight coupling!
    
    public void saveUser(User user) {
        database.save(user.toString());
    }
}

// GOOD - Both depend on abstractions
public interface Database {
    void save(String data);
}

public class MySQLDatabase implements Database {
    @Override
    public void save(String data) { /* MySQL implementation */ }
}

public class MongoDatabase implements Database {
    @Override
    public void save(String data) { /* MongoDB implementation */ }
}

public class UserService {
    private final Database database;
    
    // Dependency Injection
    public UserService(Database database) {
        this.database = database;
    }
    
    public void saveUser(User user) {
        database.save(user.toString());
    }
}

// Usage with Spring
@Service
public class UserService {
    private final Database database;
    
    @Autowired
    public UserService(Database database) {
        this.database = database;
    }
}
```

### 2.3 Design Patterns

```java
// CREATIONAL PATTERNS

// 1. Singleton
public class Singleton {
    private static volatile Singleton instance;
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}

// Better: Enum Singleton
public enum SingletonEnum {
    INSTANCE;
    
    public void doSomething() { /* ... */ }
}

// 2. Factory Method
public interface PaymentProcessor {
    void process(Payment payment);
}

public class CreditCardProcessor implements PaymentProcessor { /* ... */ }
public class PayPalProcessor implements PaymentProcessor { /* ... */ }

public class PaymentProcessorFactory {
    public static PaymentProcessor create(String type) {
        return switch (type) {
            case "CREDIT_CARD" -> new CreditCardProcessor();
            case "PAYPAL" -> new PayPalProcessor();
            default -> throw new IllegalArgumentException("Unknown type");
        };
    }
}

// 3. Builder
public class User {
    private final String name;
    private final String email;
    private final int age;
    private final String address;
    
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
        this.address = builder.address;
    }
    
    public static class Builder {
        private String name;
        private String email;
        private int age;
        private String address;
        
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
        
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

// Usage
User user = new User.Builder()
    .name("John")
    .email("john@example.com")
    .age(30)
    .build();

// STRUCTURAL PATTERNS

// 4. Adapter
public interface MediaPlayer {
    void play(String filename);
}

public class VlcPlayer {
    public void playVlc(String filename) { /* ... */ }
}

public class VlcAdapter implements MediaPlayer {
    private VlcPlayer vlcPlayer = new VlcPlayer();
    
    @Override
    public void play(String filename) {
        vlcPlayer.playVlc(filename);
    }
}

// 5. Decorator
public interface Coffee {
    double cost();
    String description();
}

public class SimpleCoffee implements Coffee {
    @Override
    public double cost() { return 1.0; }
    
    @Override
    public String description() { return "Simple coffee"; }
}

public abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public double cost() { return coffee.cost() + 0.5; }
    
    @Override
    public String description() { return coffee.description() + ", milk"; }
}

// Usage
Coffee coffee = new MilkDecorator(new SimpleCoffee());
// cost: 1.5, description: "Simple coffee, milk"

// BEHAVIORAL PATTERNS

// 6. Strategy
public interface SortStrategy {
    void sort(int[] array);
}

public class QuickSort implements SortStrategy {
    @Override
    public void sort(int[] array) { /* Quick sort implementation */ }
}

public class MergeSort implements SortStrategy {
    @Override
    public void sort(int[] array) { /* Merge sort implementation */ }
}

public class Sorter {
    private SortStrategy strategy;
    
    public void setStrategy(SortStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void sort(int[] array) {
        strategy.sort(array);
    }
}

// 7. Observer
public interface Observer {
    void update(String event);
}

public class EventManager {
    private List<Observer> observers = new ArrayList<>();
    
    public void subscribe(Observer observer) {
        observers.add(observer);
    }
    
    public void unsubscribe(Observer observer) {
        observers.remove(observer);
    }
    
    public void notify(String event) {
        for (Observer observer : observers) {
            observer.update(event);
        }
    }
}
```

### OOP & SOLID Interview Questions

**Q1: What is the difference between abstract class and interface?**

| Aspect | Abstract Class | Interface |
|--------|---------------|-----------|
| Methods | Abstract + concrete | Abstract (+ default since Java 8) |
| Variables | Any type | public static final only |
| Constructor | YES | NO |
| Multiple inheritance | NO | YES |
| Access modifiers | Any | public (implicit) |
| Use case | IS-A relationship | CAN-DO capability |

**Q2: Why favor composition over inheritance?**

```java
// Inheritance - Tight coupling, fragile base class problem
public class Stack extends ArrayList {
    public void push(Object o) { add(o); }
    public Object pop() { return remove(size() - 1); }
    // Problem: Users can call add(), remove(), get() directly!
}

// Composition - Loose coupling, better encapsulation
public class Stack {
    private final List<Object> list = new ArrayList<>();
    
    public void push(Object o) { list.add(o); }
    public Object pop() { return list.remove(list.size() - 1); }
    // Only push/pop are exposed
}
```

**Q3: Explain the Template Method pattern**

```java
public abstract class DataParser {
    // Template method - defines the algorithm skeleton
    public final void parse(String filePath) {
        String data = readFile(filePath);
        String processed = processData(data);
        saveResult(processed);
    }
    
    protected abstract String readFile(String filePath);
    protected abstract String processData(String data);
    
    // Default implementation - can be overridden
    protected void saveResult(String result) {
        System.out.println("Saving: " + result);
    }
}

public class JsonParser extends DataParser {
    @Override
    protected String readFile(String filePath) {
        // Read JSON file
        return "json content";
    }
    
    @Override
    protected String processData(String data) {
        // Parse JSON
        return "processed json";
    }
}
```

---

## 3. Spring Boot Framework

### 3.1 Spring Boot Fundamentals

```java
// Main Application
@SpringBootApplication  // Combines @Configuration, @EnableAutoConfiguration, @ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

/*
@SpringBootApplication is equivalent to:
- @Configuration: Marks class as a source of bean definitions
- @EnableAutoConfiguration: Enables Spring Boot's auto-configuration
- @ComponentScan: Scans for components in current package and sub-packages
*/
```

**Spring Boot Auto-Configuration:**

```java
// Auto-configuration happens based on:
// 1. Classes on the classpath
// 2. Beans already defined
// 3. Properties set

// Example: DataSource auto-configuration
// If spring-boot-starter-data-jpa is on classpath AND
// spring.datasource.* properties are set
// Spring Boot automatically configures DataSource, EntityManagerFactory, etc.

// Disable specific auto-configuration
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class Application { }

// Or in application.properties
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

**Spring Boot Starters:**

| Starter | Description |
|---------|-------------|
| spring-boot-starter-web | Web apps, REST APIs (includes Tomcat) |
| spring-boot-starter-data-jpa | JPA with Hibernate |
| spring-boot-starter-security | Spring Security |
| spring-boot-starter-validation | Bean validation (Hibernate Validator) |
| spring-boot-starter-test | Testing (JUnit, Mockito, etc.) |
| spring-boot-starter-actuator | Production-ready features |
| spring-boot-starter-cache | Caching support |

### 3.2 Dependency Injection & IoC Container

```java
// Spring IoC Container manages object lifecycle and dependencies
// Beans are objects managed by Spring container

// STEREOTYPE ANNOTATIONS

@Component      // Generic Spring-managed component
@Service        // Business logic layer
@Repository     // Data access layer (adds exception translation)
@Controller     // Web MVC controller
@RestController // @Controller + @ResponseBody
@Configuration  // Configuration class with @Bean methods

// DEPENDENCY INJECTION METHODS

// 1. Constructor Injection (RECOMMENDED)
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // @Autowired is optional for single constructor (Spring 4.3+)
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}

// 2. Field Injection (NOT RECOMMENDED - hard to test)
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}

// 3. Setter Injection (for optional dependencies)
@Service
public class UserService {
    private EmailService emailService;
    
    @Autowired(required = false)
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
}

// BEAN SCOPES

@Component
@Scope("singleton")  // Default - one instance per container
@Scope("prototype")  // New instance for each request
@Scope("request")    // One instance per HTTP request
@Scope("session")    // One instance per HTTP session
public class MyBean { }

// BEAN LIFECYCLE

@Component
public class LifecycleBean {
    
    @PostConstruct
    public void init() {
        // Called after dependency injection
    }
    
    @PreDestroy
    public void cleanup() {
        // Called before bean is destroyed
    }
}

// Or implement interfaces
public class LifecycleBean implements InitializingBean, DisposableBean {
    @Override
    public void afterPropertiesSet() { /* init */ }
    
    @Override
    public void destroy() { /* cleanup */ }
}

// CONDITIONAL BEANS

@Configuration
public class AppConfig {
    
    @Bean
    @ConditionalOnProperty(name = "cache.enabled", havingValue = "true")
    public CacheService cacheService() {
        return new RedisCacheService();
    }
    
    @Bean
    @ConditionalOnMissingBean(CacheService.class)
    public CacheService defaultCacheService() {
        return new InMemoryCacheService();
    }
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new EmbeddedDatabaseBuilder().build();
    }
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        return DataSourceBuilder.create()
            .url("jdbc:postgresql://prod-db:5432/app")
            .build();
    }
}

// QUALIFIER FOR MULTIPLE IMPLEMENTATIONS

public interface PaymentService { }

@Service
@Qualifier("creditCard")
public class CreditCardPaymentService implements PaymentService { }

@Service
@Qualifier("paypal")
public class PayPalPaymentService implements PaymentService { }

@Service
public class OrderService {
    private final PaymentService paymentService;
    
    public OrderService(@Qualifier("creditCard") PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}

// Or use @Primary
@Service
@Primary  // Default when no qualifier specified
public class CreditCardPaymentService implements PaymentService { }
```

### 3.3 Configuration Management

```yaml
# application.yml - Main configuration
spring:
  application:
    name: my-application
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

server:
  port: 8080
  servlet:
    context-path: /api

# Database
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USERNAME:user}
    password: ${DB_PASSWORD:password}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5

# JPA
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # none, validate, update, create, create-drop
    show-sql: false
    properties:
      hibernate:
        format_sql: true

# Logging
logging:
  level:
    root: INFO
    com.myapp: DEBUG
    org.hibernate.SQL: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

```yaml
# application-dev.yml - Development profile
spring:
  datasource:
    url: jdbc:h2:mem:testdb
  jpa:
    hibernate:
      ddl-auto: create-drop
  h2:
    console:
      enabled: true

logging:
  level:
    com.myapp: DEBUG
```

```yaml
# application-prod.yml - Production profile
spring:
  datasource:
    url: jdbc:postgresql://prod-server:5432/mydb
  jpa:
    hibernate:
      ddl-auto: none

logging:
  level:
    root: WARN
    com.myapp: INFO
```

```java
// Reading configuration values

// 1. @Value annotation
@Service
public class MyService {
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.timeout:30}")  // Default value
    private int timeout;
    
    @Value("${app.features.enabled:false}")
    private boolean featuresEnabled;
    
    @Value("${app.allowed-origins}")
    private List<String> allowedOrigins;
}

// 2. @ConfigurationProperties (RECOMMENDED for groups)
@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    
    @NotBlank
    private String name;
    
    @Min(1)
    @Max(300)
    private int timeout = 30;
    
    private List<String> allowedOrigins = new ArrayList<>();
    
    private final Security security = new Security();
    
    // Nested configuration
    public static class Security {
        private String jwtSecret;
        private long jwtExpiration = 86400000;
        
        // Getters and setters
    }
    
    // Getters and setters
}

// Usage
@Service
@RequiredArgsConstructor
public class MyService {
    private final AppProperties appProperties;
    
    public void doSomething() {
        String secret = appProperties.getSecurity().getJwtSecret();
    }
}

// Enable configuration properties
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class Application { }
```

### 3.4 REST API Development

```java
// Controller
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
public class UserController {
    
    private final UserService userService;
    
    // GET /api/v1/users
    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {
        
        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        return ResponseEntity.ok(userService.findAll(pageable));
    }
    
    // GET /api/v1/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }
    
    // POST /api/v1/users
    @PostMapping
    public ResponseEntity<UserDTO> createUser(
            @RequestBody @Valid CreateUserRequest request) {
        
        UserDTO created = userService.create(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.getId())
            .toUri();
        
        return ResponseEntity.created(location).body(created);
    }
    
    // PUT /api/v1/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUserRequest request) {
        
        return ResponseEntity.ok(userService.update(id, request));
    }
    
    // PATCH /api/v1/users/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<UserDTO> patchUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        
        return ResponseEntity.ok(userService.patch(id, updates));
    }
    
    // DELETE /api/v1/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // GET /api/v1/users/search?name=John&status=ACTIVE
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) UserStatus status) {
        
        return ResponseEntity.ok(userService.search(name, status));
    }
}

// REQUEST MAPPING ANNOTATIONS
/*
@GetMapping     - HTTP GET
@PostMapping    - HTTP POST
@PutMapping     - HTTP PUT
@PatchMapping   - HTTP PATCH
@DeleteMapping  - HTTP DELETE

@RequestMapping(method = RequestMethod.GET, path = "/users")
*/

// PARAMETER ANNOTATIONS
/*
@PathVariable   - URL path variable: /users/{id}
@RequestParam   - Query parameter: /users?name=John
@RequestBody    - Request body (JSON)
@RequestHeader  - HTTP header
@CookieValue    - Cookie value
@ModelAttribute - Form data / model binding
*/

// Response customization
@GetMapping("/{id}")
public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
    UserDTO user = userService.findById(id);
    
    return ResponseEntity
        .ok()
        .header("X-Custom-Header", "value")
        .cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
        .eTag(String.valueOf(user.getVersion()))
        .body(user);
}

// File upload
@PostMapping("/upload")
public ResponseEntity<String> uploadFile(
        @RequestParam("file") MultipartFile file) {
    
    String filename = fileService.store(file);
    return ResponseEntity.ok("Uploaded: " + filename);
}

// File download
@GetMapping("/download/{filename}")
public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
    Resource resource = fileService.loadAsResource(filename);
    
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
}
```

### 3.5 Exception Handling

```java
// Custom exceptions
public class ResourceNotFoundException extends RuntimeException {
    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}

public class BusinessException extends RuntimeException {
    private final String errorCode;
    
    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

// Error response DTO
@Data
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;
    
    public static ErrorResponse of(HttpStatus status, String message, String path) {
        return ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(status.value())
            .error(status.getReasonPhrase())
            .message(message)
            .path(path)
            .build();
    }
}

// Global exception handler
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        
        log.warn("Resource not found: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.of(
            HttpStatus.NOT_FOUND,
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value",
                (existing, replacement) -> existing
            ));
        
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Failed")
            .message("Input validation failed")
            .path(request.getDescription(false).replace("uri=", ""))
            .validationErrors(errors)
            .build();
        
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {
        
        Map<String, String> errors = ex.getConstraintViolations()
            .stream()
            .collect(Collectors.toMap(
                v -> v.getPropertyPath().toString(),
                ConstraintViolation::getMessage
            ));
        
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Constraint Violation")
            .message("Validation failed")
            .validationErrors(errors)
            .build();
        
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex, WebRequest request) {
        
        log.error("Business error: {} - {}", ex.getErrorCode(), ex.getMessage());
        
        ErrorResponse error = ErrorResponse.of(
            HttpStatus.UNPROCESSABLE_ENTITY,
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(
            DataIntegrityViolationException ex, WebRequest request) {
        
        log.error("Data integrity violation", ex);
        
        ErrorResponse error = ErrorResponse.of(
            HttpStatus.CONFLICT,
            "Data integrity violation. Resource may already exist.",
            request.getDescription(false).replace("uri=", "")
        );
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {
        
        log.error("Unexpected error", ex);
        
        ErrorResponse error = ErrorResponse.of(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred",
            request.getDescription(false).replace("uri=", "")
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

### 3.6 Validation

```java
// Request DTO with validation
public class CreateUserRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Must be at least 18 years old")
    @Max(value = 150, message = "Invalid age")
    private Integer age;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phone;
    
    @Valid  // Validate nested object
    private AddressDTO address;
    
    @NotEmpty(message = "At least one role is required")
    private List<@NotBlank String> roles;
}

// Custom validator
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    
    private final UserRepository userRepository;
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) return true;
        return !userRepository.existsByEmail(email);
    }
}

// Cross-field validation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordMatchValidator.class)
public @interface PasswordMatch {
    String message() default "Passwords do not match";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {
    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        if (obj instanceof RegisterRequest request) {
            return request.getPassword().equals(request.getConfirmPassword());
        }
        return true;
    }
}

// Validation groups
public interface OnCreate {}
public interface OnUpdate {}

public class UserDTO {
    @Null(groups = OnCreate.class)
    @NotNull(groups = OnUpdate.class)
    private Long id;
    
    @NotBlank(groups = {OnCreate.class, OnUpdate.class})
    private String name;
}

// Controller with validation groups
@PostMapping
public ResponseEntity<UserDTO> create(
        @RequestBody @Validated(OnCreate.class) UserDTO dto) {
    // ...
}

@PutMapping("/{id}")
public ResponseEntity<UserDTO> update(
        @PathVariable Long id,
        @RequestBody @Validated(OnUpdate.class) UserDTO dto) {
    // ...
}

// Method-level validation
@Service
@Validated
public class UserService {
    
    public User findById(@NotNull @Min(1) Long id) {
        // ...
    }
    
    public void updateEmail(
            @NotNull Long userId, 
            @NotBlank @Email String email) {
        // ...
    }
}
```

### 3.7 Spring Boot Actuator

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,loggers,env
      base-path: /actuator
  endpoint:
    health:
      show-details: when_authorized
      show-components: always
  health:
    db:
      enabled: true
    redis:
      enabled: true

info:
  app:
    name: ${spring.application.name}
    version: '@project.version@'
    description: My Application
```

```java
// Custom health indicator
@Component
public class ExternalServiceHealthIndicator implements HealthIndicator {
    
    private final RestTemplate restTemplate;
    
    public ExternalServiceHealthIndicator(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    @Override
    public Health health() {
        try {
            ResponseEntity<String> response = restTemplate
                .getForEntity("http://external-service/health", String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return Health.up()
                    .withDetail("service", "external-service")
                    .withDetail("status", "available")
                    .build();
            }
            return Health.down()
                .withDetail("service", "external-service")
                .withDetail("status", "unavailable")
                .build();
                
        } catch (Exception e) {
            return Health.down()
                .withDetail("service", "external-service")
                .withException(e)
                .build();
        }
    }
}

// Custom metrics
@Service
public class OrderService {
    
    private final Counter orderCounter;
    private final Timer orderTimer;
    private final AtomicInteger activeOrders;
    
    public OrderService(MeterRegistry registry) {
        this.orderCounter = Counter.builder("orders.created.total")
            .description("Total orders created")
            .tag("type", "all")
            .register(registry);
            
        this.orderTimer = Timer.builder("orders.processing.time")
            .description("Order processing time")
            .register(registry);
            
        this.activeOrders = registry.gauge("orders.active", new AtomicInteger(0));
    }
    
    public Order createOrder(OrderRequest request) {
        return orderTimer.record(() -> {
            activeOrders.incrementAndGet();
            try {
                Order order = processOrder(request);
                orderCounter.increment();
                return order;
            } finally {
                activeOrders.decrementAndGet();
            }
        });
    }
}

// Custom info contributor
@Component
public class CustomInfoContributor implements InfoContributor {
    
    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("custom", Map.of(
            "feature-flags", getFeatureFlags(),
            "build-time", getBuildTime()
        ));
    }
}
```

### 3.8 Async Processing

```java
// Enable async
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(25);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
    
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> {
            log.error("Async error in method {}: {}", method.getName(), ex.getMessage(), ex);
        };
    }
}

// Async methods
@Service
@Slf4j
public class EmailService {
    
    @Async
    public void sendEmailAsync(String to, String subject, String body) {
        // This runs in a separate thread
        log.info("Sending email to {} in thread {}", to, Thread.currentThread().getName());
        // Send email...
    }
    
    @Async
    public CompletableFuture<EmailResult> sendEmailWithResult(String to, String subject) {
        // Return result asynchronously
        EmailResult result = doSendEmail(to, subject);
        return CompletableFuture.completedFuture(result);
    }
}

// Using async results
@Service
public class NotificationService {
    
    @Autowired
    private EmailService emailService;
    
    public void notifyAll(List<User> users) {
        List<CompletableFuture<EmailResult>> futures = users.stream()
            .map(user -> emailService.sendEmailWithResult(user.getEmail(), "Notification"))
            .collect(Collectors.toList());
        
        // Wait for all to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
            .thenRun(() -> log.info("All notifications sent"))
            .exceptionally(ex -> {
                log.error("Error sending notifications", ex);
                return null;
            });
    }
}
```

### 3.9 Scheduling

```java
// Enable scheduling
@Configuration
@EnableScheduling
public class SchedulingConfig {
    
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(5);
        scheduler.setThreadNamePrefix("scheduled-");
        return scheduler;
    }
}

// Scheduled tasks
@Component
@Slf4j
public class ScheduledTasks {
    
    // Fixed rate - runs every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void runEvery5Seconds() {
        log.info("Fixed rate task - {}", LocalDateTime.now());
    }
    
    // Fixed delay - 5 seconds after previous completion
    @Scheduled(fixedDelay = 5000)
    public void runWith5SecondDelay() {
        log.info("Fixed delay task - {}", LocalDateTime.now());
    }
    
    // Initial delay
    @Scheduled(fixedRate = 5000, initialDelay = 10000)
    public void runWithInitialDelay() {
        log.info("Task with initial delay");
    }
    
    // Cron expression
    @Scheduled(cron = "0 0 2 * * ?")  // Every day at 2 AM
    public void runDailyAt2AM() {
        log.info("Daily cleanup task");
    }
    
    // Cron with timezone
    @Scheduled(cron = "0 0 9 * * MON-FRI", zone = "America/New_York")
    public void runWeekdaysAt9AM() {
        log.info("Weekday morning task");
    }
    
    // Conditional scheduling
    @Scheduled(cron = "${app.cleanup.cron:0 0 3 * * ?}")
    @ConditionalOnProperty(name = "app.cleanup.enabled", havingValue = "true")
    public void conditionalCleanup() {
        log.info("Conditional cleanup");
    }
}

/*
Cron Expression Format:
┌───────────── second (0-59)
│ ┌───────────── minute (0-59)
│ │ ┌───────────── hour (0-23)
│ │ │ ┌───────────── day of month (1-31)
│ │ │ │ ┌───────────── month (1-12)
│ │ │ │ │ ┌───────────── day of week (0-7, SUN-SAT)
│ │ │ │ │ │
* * * * * *

Examples:
0 0 * * * *     - Every hour
0 0 0 * * *     - Every day at midnight
0 0 0 1 * *     - First day of every month
0 0 0 * * MON   - Every Monday
0 0/30 * * * *  - Every 30 minutes
*/
```

### 3.10 Caching

```java
// Enable caching
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(10))
            .recordStats());
        return manager;
    }
    
    // Or use Redis
    @Bean
    public RedisCacheManager redisCacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .withCacheConfiguration("users", 
                config.entryTtl(Duration.ofHours(1)))
            .withCacheConfiguration("products", 
                config.entryTtl(Duration.ofMinutes(15)))
            .build();
    }
}

// Using cache annotations
@Service
public class UserService {
    
    // Cache the result
    @Cacheable(value = "users", key = "#id")
    public User findById(Long id) {
        log.info("Fetching user from database: {}", id);
        return userRepository.findById(id).orElseThrow();
    }
    
    // Cache with condition
    @Cacheable(value = "users", key = "#id", condition = "#id > 0")
    public User findByIdConditional(Long id) {
        return userRepository.findById(id).orElseThrow();
    }
    
    // Cache unless result is null
    @Cacheable(value = "users", key = "#email", unless = "#result == null")
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    // Update cache
    @CachePut(value = "users", key = "#user.id")
    public User update(User user) {
        return userRepository.save(user);
    }
    
    // Evict cache
    @CacheEvict(value = "users", key = "#id")
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
    
    // Evict all entries
    @CacheEvict(value = "users", allEntries = true)
    public void clearCache() {
        log.info("Cache cleared");
    }
    
    // Multiple cache operations
    @Caching(
        put = @CachePut(value = "users", key = "#result.id"),
        evict = @CacheEvict(value = "user-list", allEntries = true)
    )
    public User create(User user) {
        return userRepository.save(user);
    }
}
```

### Spring Boot Interview Questions

**Q1: What is the difference between @Component, @Service, @Repository, and @Controller?**

| Annotation | Purpose | Special Behavior |
|------------|---------|------------------|
| @Component | Generic bean | None |
| @Service | Business logic | Semantic only |
| @Repository | Data access | Exception translation to DataAccessException |
| @Controller | Web MVC | Enables @RequestMapping |
| @RestController | REST API | @Controller + @ResponseBody |

**Q2: How does Spring Boot auto-configuration work?**

1. Spring Boot scans `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`
2. Each auto-configuration class has `@Conditional*` annotations
3. Beans are created only if conditions are met (classpath, properties, existing beans)
4. You can override auto-configured beans with your own `@Bean` definitions

**Q3: What is the difference between @Autowired and constructor injection?**

```java
// Field injection - NOT RECOMMENDED
@Autowired
private UserRepository repository;  // Hard to test, hidden dependencies

// Constructor injection - RECOMMENDED
private final UserRepository repository;

public UserService(UserRepository repository) {
    this.repository = repository;  // Explicit, testable, immutable
}
```

**Q4: How do you handle circular dependencies in Spring?**

```java
// Problem: A depends on B, B depends on A
// Solutions:
// 1. Redesign (best approach)
// 2. Use @Lazy
@Service
public class ServiceA {
    private final ServiceB serviceB;
    
    public ServiceA(@Lazy ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}

// 3. Use setter injection
// 4. Use @PostConstruct to resolve dependency
```

**Q5: Explain Spring Bean lifecycle**

```
1. Instantiation (constructor)
2. Populate properties (dependency injection)
3. BeanNameAware.setBeanName()
4. BeanFactoryAware.setBeanFactory()
5. ApplicationContextAware.setApplicationContext()
6. BeanPostProcessor.postProcessBeforeInitialization()
7. @PostConstruct
8. InitializingBean.afterPropertiesSet()
9. Custom init-method
10. BeanPostProcessor.postProcessAfterInitialization()
--- Bean is ready to use ---
11. @PreDestroy
12. DisposableBean.destroy()
13. Custom destroy-method
```

---

## 4. ORM (JPA & Hibernate)

### 3.1 JPA Basics

```java
// Entity mapping
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_name", nullable = false, length = 100)
    private String username;
    
    @Column(unique = true)
    private String email;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @Embedded
    private Address address;
    
    @Transient // Not persisted
    private String temporaryData;
}

@Embeddable
public class Address {
    private String street;
    private String city;
    private String zipCode;
}
```

### 3.2 Relationships

```java
// ONE-TO-ONE
@Entity
public class User {
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private Profile profile;
}

// ONE-TO-MANY / MANY-TO-ONE
@Entity
public class Department {
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Employee> employees = new ArrayList<>();
    
    // Helper methods for bidirectional consistency
    public void addEmployee(Employee employee) {
        employees.add(employee);
        employee.setDepartment(this);
    }
    
    public void removeEmployee(Employee employee) {
        employees.remove(employee);
        employee.setDepartment(null);
    }
}

@Entity
public class Employee {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}

// MANY-TO-MANY
@Entity
public class Student {
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

### 3.3 Fetching Strategies

```java
// LAZY vs EAGER
@ManyToOne(fetch = FetchType.LAZY)  // Load on access (default for collections)
@ManyToOne(fetch = FetchType.EAGER) // Load immediately (default for single entity)

// N+1 Problem
// BAD - Executes N+1 queries
List<Department> departments = repository.findAll();
for (Department dept : departments) {
    dept.getEmployees().size(); // Each access = 1 query
}

// SOLUTION 1: JOIN FETCH
@Query("SELECT d FROM Department d JOIN FETCH d.employees")
List<Department> findAllWithEmployees();

// SOLUTION 2: Entity Graph
@EntityGraph(attributePaths = {"employees"})
List<Department> findAll();

// SOLUTION 3: Batch fetching
@BatchSize(size = 25)
@OneToMany(mappedBy = "department")
private List<Employee> employees;
```

### 3.4 JPQL and Criteria API

```java
// JPQL
@Query("SELECT u FROM User u WHERE u.status = :status AND u.createdAt > :date")
List<User> findActiveUsersAfter(@Param("status") UserStatus status, 
                                 @Param("date") LocalDateTime date);

// Named queries
@Entity
@NamedQuery(name = "User.findByEmail", 
            query = "SELECT u FROM User u WHERE u.email = :email")
public class User { /* ... */ }

// Criteria API - Type-safe queries
public List<User> findUsersByCriteria(String name, UserStatus status) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<User> query = cb.createQuery(User.class);
    Root<User> root = query.from(User.class);
    
    List<Predicate> predicates = new ArrayList<>();
    
    if (name != null) {
        predicates.add(cb.like(root.get("name"), "%" + name + "%"));
    }
    if (status != null) {
        predicates.add(cb.equal(root.get("status"), status));
    }
    
    query.where(predicates.toArray(new Predicate[0]));
    
    return entityManager.createQuery(query).getResultList();
}

// Specification (Spring Data JPA)
public interface UserRepository extends JpaRepository<User, Long>, 
                                        JpaSpecificationExecutor<User> {}

public class UserSpecifications {
    public static Specification<User> hasStatus(UserStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }
    
    public static Specification<User> nameLike(String name) {
        return (root, query, cb) -> cb.like(root.get("name"), "%" + name + "%");
    }
}

// Usage
List<User> users = userRepository.findAll(
    UserSpecifications.hasStatus(ACTIVE)
        .and(UserSpecifications.nameLike("John"))
);
```

### 3.5 Transactions

```java
// Spring Transaction Management
@Service
@Transactional(readOnly = true) // Class-level default
public class UserService {
    
    @Transactional // Overrides class-level for write operations
    public User createUser(UserDTO dto) {
        User user = new User(dto.getName(), dto.getEmail());
        return userRepository.save(user);
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void auditLog(String action) {
        // Runs in a new transaction
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void criticalOperation() {
        // Highest isolation level
    }
    
    @Transactional(rollbackFor = BusinessException.class)
    public void businessOperation() throws BusinessException {
        // Rolls back on BusinessException
    }
}

// Transaction propagation types
/*
REQUIRED (default) - Join existing or create new
REQUIRES_NEW      - Always create new (suspend existing)
SUPPORTS          - Join if exists, otherwise non-transactional
NOT_SUPPORTED     - Suspend existing, run non-transactional
MANDATORY         - Must have existing transaction
NEVER             - Must NOT have existing transaction
NESTED            - Nested transaction with savepoints
*/

// Isolation levels
/*
READ_UNCOMMITTED - Dirty reads possible
READ_COMMITTED   - No dirty reads (default for most DBs)
REPEATABLE_READ  - No dirty or non-repeatable reads
SERIALIZABLE     - Full isolation (slowest)
*/
```

### 3.6 Auditing

```java
// Enable JPA Auditing
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
            .map(SecurityContext::getAuthentication)
            .map(Authentication::getName);
    }
}

// Auditable base entity
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    private String updatedBy;
    
    @Version // Optimistic locking
    private Long version;
}
```

### ORM Interview Questions

**Q1: What is the difference between get() and load() in Hibernate?**

| Aspect | get() | load() |
|--------|-------|--------|
| If not found | Returns null | Throws ObjectNotFoundException |
| Database hit | Immediately | Lazy (proxy) |
| Return type | Actual object | Proxy object |
| Use case | When unsure if exists | When sure it exists |

**Q2: Explain the Hibernate Session states**

```
┌─────────────┐    persist()    ┌─────────────┐
│  Transient  │ ───────────────>│  Persistent │
│ (new object)│                 │ (in session)│
└─────────────┘                 └─────────────┘
                                      │ │
                  detach()/close()    │ │  merge()
                  <───────────────────┘ └──────────────>
                                                        
┌─────────────┐   remove()      ┌─────────────┐
│  Detached   │ <───────────────│   Removed   │
│(out session)│                 │ (marked del)│
└─────────────┘                 └─────────────┘
```

**Q3: How do you handle the LazyInitializationException?**

```java
// Problem: Accessing lazy-loaded data outside session
User user = userRepository.findById(1L);
user.getOrders().size(); // Exception if session closed!

// Solution 1: FETCH JOIN
@Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")
User findByIdWithOrders(@Param("id") Long id);

// Solution 2: @EntityGraph
@EntityGraph(attributePaths = {"orders"})
Optional<User> findById(Long id);

// Solution 3: Open Session in View (anti-pattern, but sometimes used)
spring.jpa.open-in-view=true

// Solution 4: DTO projection
@Query("SELECT new com.example.UserOrderDTO(u.name, o.total) " +
       "FROM User u JOIN u.orders o WHERE u.id = :id")
List<UserOrderDTO> findUserOrders(@Param("id") Long id);
```

---

## 5. Testing Framework

### 5.1 JUnit 5

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    
    private Calculator calculator;
    
    @BeforeAll
    static void setupAll() {
        // Runs once before all tests
    }
    
    @BeforeEach
    void setup() {
        calculator = new Calculator();
    }
    
    @Test
    @DisplayName("Should add two numbers correctly")
    void shouldAddNumbers() {
        assertEquals(5, calculator.add(2, 3));
    }
    
    @Test
    void shouldThrowExceptionForDivisionByZero() {
        assertThrows(ArithmeticException.class, () -> {
            calculator.divide(10, 0);
        });
    }
    
    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3, 4, 5})
    void shouldBePositive(int number) {
        assertTrue(number > 0);
    }
    
    @ParameterizedTest
    @CsvSource({
        "1, 2, 3",
        "10, 20, 30",
        "-1, 1, 0"
    })
    void shouldAddWithCsv(int a, int b, int expected) {
        assertEquals(expected, calculator.add(a, b));
    }
    
    @ParameterizedTest
    @MethodSource("provideStringsForIsBlank")
    void shouldDetectBlankStrings(String input, boolean expected) {
        assertEquals(expected, StringUtils.isBlank(input));
    }
    
    static Stream<Arguments> provideStringsForIsBlank() {
        return Stream.of(
            Arguments.of("", true),
            Arguments.of("  ", true),
            Arguments.of("hello", false)
        );
    }
    
    @Nested
    @DisplayName("When using subtraction")
    class SubtractionTests {
        @Test
        void shouldSubtract() {
            assertEquals(2, calculator.subtract(5, 3));
        }
    }
    
    @Test
    @Disabled("Not implemented yet")
    void futureTest() {}
    
    @AfterEach
    void tearDown() {
        // Cleanup after each test
    }
    
    @AfterAll
    static void tearDownAll() {
        // Cleanup after all tests
    }
}
```

### 5.2 Mockito

```java
import org.mockito.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private EmailService emailService;
    
    @InjectMocks
    private UserService userService;
    
    @Captor
    private ArgumentCaptor<User> userCaptor;
    
    @Test
    void shouldCreateUser() {
        // Given
        UserDTO dto = new UserDTO("John", "john@example.com");
        User savedUser = new User(1L, "John", "john@example.com");
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        // When
        User result = userService.createUser(dto);
        
        // Then
        assertNotNull(result);
        assertEquals("John", result.getName());
        
        verify(userRepository).save(userCaptor.capture());
        User captured = userCaptor.getValue();
        assertEquals("john@example.com", captured.getEmail());
        
        verify(emailService).sendWelcomeEmail(savedUser);
    }
    
    @Test
    void shouldHandleNotFoundException() {
        // Given
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserById(1L);
        });
        
        verify(userRepository).findById(1L);
        verifyNoInteractions(emailService);
    }
    
    @Test
    void shouldVerifyMethodCalls() {
        // Given
        User user = new User(1L, "John", "john@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // When
        userService.getUserById(1L);
        userService.getUserById(1L);
        
        // Then
        verify(userRepository, times(2)).findById(1L);
        verify(userRepository, never()).delete(any());
        verify(userRepository, atLeastOnce()).findById(anyLong());
    }
    
    @Test
    void shouldMockVoidMethod() {
        // Given
        doNothing().when(emailService).sendEmail(any(), any(), any());
        doThrow(new RuntimeException("Failed")).when(emailService)
            .sendEmail(eq("invalid"), any(), any());
        
        // When & Then
        assertDoesNotThrow(() -> userService.notifyUser("valid@email.com"));
        assertThrows(RuntimeException.class, () -> userService.notifyUser("invalid"));
    }
    
    @Test
    void shouldUseSpies() {
        // Spy wraps real object
        List<String> list = spy(new ArrayList<>());
        
        list.add("one");
        list.add("two");
        
        assertEquals(2, list.size()); // Real behavior
        
        // Can override specific methods
        doReturn(100).when(list).size();
        assertEquals(100, list.size()); // Mocked behavior
    }
    
    @Test
    void shouldAnswerDynamically() {
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });
        
        User result = userRepository.save(new User(null, "Test", "test@test.com"));
        assertEquals(1L, result.getId());
    }
}
```

### 5.3 Spring Boot Testing

```java
// Unit Test - @WebMvcTest
@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void shouldReturnUser() throws Exception {
        User user = new User(1L, "John", "john@example.com");
        when(userService.getUserById(1L)).thenReturn(user);
        
        mockMvc.perform(get("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("John"))
            .andExpect(jsonPath("$.email").value("john@example.com"));
    }
    
    @Test
    void shouldCreateUser() throws Exception {
        UserDTO dto = new UserDTO("John", "john@example.com");
        User created = new User(1L, "John", "john@example.com");
        when(userService.createUser(any())).thenReturn(created);
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(jsonPath("$.id").value(1));
    }
}

// Integration Test - @SpringBootTest
@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Rollback after each test
class UserIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldCreateAndRetrieveUser() throws Exception {
        // Create
        MvcResult result = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"John\",\"email\":\"john@test.com\"}"))
            .andExpect(status().isCreated())
            .andReturn();
        
        // Retrieve
        Long id = extractId(result);
        mockMvc.perform(get("/api/users/" + id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("John"));
        
        // Verify database
        assertTrue(userRepository.findById(id).isPresent());
    }
}

// Repository Test - @DataJpaTest
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldFindByEmail() {
        User user = new User(null, "John", "john@test.com");
        entityManager.persistAndFlush(user);
        
        Optional<User> found = userRepository.findByEmail("john@test.com");
        
        assertTrue(found.isPresent());
        assertEquals("John", found.get().getName());
    }
}

// Testcontainers for real database
@SpringBootTest
@Testcontainers
class UserRepositoryContainerTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    
    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldPersistUser() {
        User user = userRepository.save(new User(null, "John", "john@test.com"));
        assertNotNull(user.getId());
    }
}
```

### 5.4 Test Coverage Best Practices

```java
// Test naming convention
@Test
void methodName_StateUnderTest_ExpectedBehavior() {
    // Given - Arrange
    // When - Act
    // Then - Assert
}

// Example
@Test
void withdraw_InsufficientFunds_ThrowsException() {
    // Given
    BankAccount account = new BankAccount(100);
    
    // When & Then
    assertThrows(InsufficientFundsException.class, () -> {
        account.withdraw(200);
    });
}

// Testing exceptions with message
@Test
void shouldThrowWithMessage() {
    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
        userService.createUser(null);
    });
    
    assertEquals("User cannot be null", exception.getMessage());
}

// Testing async code
@Test
void shouldHandleAsync() {
    CompletableFuture<String> future = asyncService.fetchData();
    
    // Wait with timeout
    String result = assertTimeout(Duration.ofSeconds(5), () -> future.get());
    assertEquals("data", result);
}

// AssertJ for fluent assertions
@Test
void shouldUseAssertJ() {
    List<User> users = userService.findAll();
    
    assertThat(users)
        .isNotEmpty()
        .hasSize(3)
        .extracting(User::getName)
        .containsExactly("Alice", "Bob", "Charlie");
}
```

### Testing Interview Questions

**Q1: What is the difference between @Mock and @MockBean?**

| Aspect | @Mock | @MockBean |
|--------|-------|-----------|
| Framework | Mockito | Spring Boot Test |
| Context | Unit tests | Spring context |
| Scope | Test class | Spring bean replacement |
| Use with | @ExtendWith(MockitoExtension.class) | @SpringBootTest |

**Q2: When should you use integration tests vs unit tests?**

- **Unit Tests**: Fast, isolated, test single units (methods/classes)
- **Integration Tests**: Test component interactions, database, APIs
- **Ratio**: ~70% unit, ~20% integration, ~10% E2E

**Q3: How do you test private methods?**

```java
// Generally: Don't test private methods directly
// Test through public methods that use them

// If necessary: Use reflection (not recommended)
Method method = MyClass.class.getDeclaredMethod("privateMethod", String.class);
method.setAccessible(true);
Object result = method.invoke(instance, "arg");

// Better: Refactor if private method is complex enough to test separately
```

---

## 6. Authentication & Authorization

### 6.1 Spring Security Basics

```java
// Security Configuration (Spring Security 6+)
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )
            .build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

### 6.2 JWT Authentication

```java
// JWT Utility
@Component
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList()));
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
    
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
    
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claimsResolver.apply(claims);
    }
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}

// JWT Filter
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String jwt = authHeader.substring(7);
        String username = jwtUtils.extractUsername(jwt);
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtUtils.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource()
                    .buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}

// Auth Controller
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);
        
        return ResponseEntity.ok(new AuthResponse(token, refreshToken));
    }
    
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid RegisterRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDTO.from(user));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        String refreshToken = request.getRefreshToken();
        String username = jwtUtils.extractUsername(refreshToken);
        
        UserDetails userDetails = userService.loadUserByUsername(username);
        
        if (jwtUtils.isTokenValid(refreshToken, userDetails)) {
            String newToken = jwtUtils.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponse(newToken, refreshToken));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
```

### 6.3 OAuth2 / Social Login

```java
// OAuth2 Configuration
@Configuration
public class OAuth2Config {
    
    @Bean
    public SecurityFilterChain oauth2FilterChain(HttpSecurity http) throws Exception {
        return http
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(auth -> auth
                    .baseUri("/oauth2/authorize"))
                .redirectionEndpoint(redirect -> redirect
                    .baseUri("/oauth2/callback/*"))
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService))
                .successHandler(oAuth2SuccessHandler)
                .failureHandler(oAuth2FailureHandler)
            )
            .build();
    }
}

// Custom OAuth2 User Service
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    
    private final UserRepository userRepository;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(request);
        
        String provider = request.getClientRegistration().getRegistrationId();
        String providerId = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        User user = userRepository.findByProviderAndProviderId(provider, providerId)
            .orElseGet(() -> createNewUser(provider, providerId, email, name));
        
        return new CustomOAuth2User(user, oauth2User.getAttributes());
    }
    
    private User createNewUser(String provider, String providerId, String email, String name) {
        User user = User.builder()
            .provider(provider)
            .providerId(providerId)
            .email(email)
            .name(name)
            .role(Role.USER)
            .build();
        return userRepository.save(user);
    }
}

// application.yml
/*
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: profile, email
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}
            scope: user:email
*/
```

### 6.4 Method-Level Security

```java
@Service
public class UserService {
    
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) {
        // Only admins can delete
    }
    
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public User updateUser(Long userId, UserDTO dto) {
        // Admins or the user themselves
    }
    
    @PostAuthorize("returnObject.owner == authentication.principal.username")
    public Document getDocument(Long id) {
        // Check after method execution
    }
    
    @PreFilter("filterObject.owner == authentication.principal.username")
    public void processDocuments(List<Document> documents) {
        // Filters input collection
    }
    
    @PostFilter("filterObject.public or filterObject.owner == authentication.principal.username")
    public List<Document> getAllDocuments() {
        // Filters returned collection
    }
    
    @Secured({"ROLE_ADMIN", "ROLE_MODERATOR"})
    public void moderateContent() {
        // Simple role check
    }
}

// Custom Security Expression
@Component
public class CustomSecurityExpressions {
    
    public boolean isOwner(Long resourceId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Check ownership logic
        return true;
    }
}

// Usage
@PreAuthorize("@customSecurityExpressions.isOwner(#id)")
public Resource getResource(Long id) {
    // ...
}
```

### 6.5 RBAC Implementation

```java
// Role and Permission Entities
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String password;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private RoleName name;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();
}

@Entity
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name; // e.g., "USER_READ", "USER_WRITE", "USER_DELETE"
}

// UserDetails Implementation
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            getAuthorities(user.getRoles())
        );
    }
    
    private Collection<? extends GrantedAuthority> getAuthorities(Set<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName().name()));
            
            for (Permission permission : role.getPermissions()) {
                authorities.add(new SimpleGrantedAuthority(permission.getName()));
            }
        }
        
        return authorities;
    }
}

// Usage
@PreAuthorize("hasAuthority('USER_DELETE')")
public void deleteUser(Long id) {
    // Only users with USER_DELETE permission
}
```

### Security Interview Questions

**Q1: How do you prevent CSRF attacks?**

```java
// CSRF is enabled by default in Spring Security
// For stateless APIs with JWT, CSRF is typically disabled

// For stateful applications with sessions:
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .ignoringRequestMatchers("/api/public/**")
);

// Protection mechanisms:
// 1. CSRF Token in forms
// 2. SameSite cookie attribute
// 3. Check Origin/Referer headers
```

**Q2: What is the difference between authentication and authorization?**

| Aspect | Authentication | Authorization |
|--------|---------------|---------------|
| Definition | WHO you are | WHAT you can do |
| Question | "Are you who you claim to be?" | "Are you allowed to do this?" |
| Mechanism | Credentials, tokens, biometrics | Roles, permissions, policies |
| Failure | 401 Unauthorized | 403 Forbidden |

**Q3: How do you store passwords securely?**

```java
// NEVER store plain text passwords!

// Use BCrypt (recommended)
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // Cost factor
}

// Or Argon2 (more secure, slower)
@Bean
public PasswordEncoder passwordEncoder() {
    return new Argon2PasswordEncoder(16, 32, 1, 65536, 3);
}

// Password validation
boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
```

---

## 7. Best Practices

### 7.1 Exception Handling

```java
// Custom Exception Hierarchy
public abstract class BaseException extends RuntimeException {
    private final String errorCode;
    
    protected BaseException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

public class ResourceNotFoundException extends BaseException {
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id, "RESOURCE_NOT_FOUND");
    }
}

public class BusinessException extends BaseException {
    public BusinessException(String message) {
        super(message, "BUSINESS_ERROR");
    }
}

// Global Exception Handler
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse.of(ex.getErrorCode(), ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage,
                (a, b) -> a
            ));
        
        return ResponseEntity.badRequest()
            .body(ErrorResponse.of("VALIDATION_ERROR", "Validation failed", errors));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse.of("INTERNAL_ERROR", "An unexpected error occurred"));
    }
}

// Error Response DTO
@Data
@Builder
public class ErrorResponse {
    private String code;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> details;
    
    public static ErrorResponse of(String code, String message) {
        return ErrorResponse.builder()
            .code(code)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    public static ErrorResponse of(String code, String message, Map<String, String> details) {
        return ErrorResponse.builder()
            .code(code)
            .message(message)
            .timestamp(LocalDateTime.now())
            .details(details)
            .build();
    }
}
```

### 7.2 Logging

```java
// Logging with SLF4J
@Slf4j // Lombok annotation
@Service
public class UserService {
    
    public User createUser(UserDTO dto) {
        log.info("Creating user with email: {}", dto.getEmail());
        
        try {
            User user = userMapper.toEntity(dto);
            User saved = userRepository.save(user);
            log.debug("User created successfully: {}", saved.getId());
            return saved;
        } catch (DataIntegrityViolationException e) {
            log.error("Failed to create user, email already exists: {}", dto.getEmail(), e);
            throw new BusinessException("Email already registered");
        }
    }
}

// Structured Logging with MDC
public class RequestLoggingFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId);
        MDC.put("userId", getCurrentUserId());
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}

// logback-spring.xml
/*
<configuration>
    <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <includeMdcKeyName>requestId</includeMdcKeyName>
            <includeMdcKeyName>userId</includeMdcKeyName>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="JSON" />
    </root>
</configuration>
*/
```

### 7.3 Validation

```java
// Entity/DTO Validation
@Data
public class CreateUserRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Must be at least 18 years old")
    @Max(value = 150, message = "Invalid age")
    private Integer age;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phone;
    
    @Valid // Validate nested object
    private AddressDTO address;
}

// Custom Validator
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) return true;
        return !userRepository.existsByEmail(email);
    }
}

// Cross-field validation
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordMatchValidator.class)
public @interface PasswordMatch {
    String message() default "Passwords do not match";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {
    
    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        RegisterRequest request = (RegisterRequest) obj;
        return request.getPassword().equals(request.getConfirmPassword());
    }
}

// Controller usage
@RestController
@RequestMapping("/api/users")
@Validated // Enable method-level validation
public class UserController {
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid CreateUserRequest request) {
        // request is validated
    }
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers(
            @RequestParam @Min(0) int page,
            @RequestParam @Min(1) @Max(100) int size) {
        // parameters are validated
    }
}
```

### 7.4 DTO Pattern & Mapping

```java
// DTOs for different use cases
public record UserSummaryDTO(Long id, String name, String email) {}

public record UserDetailDTO(
    Long id, 
    String name, 
    String email, 
    List<RoleDTO> roles,
    LocalDateTime createdAt
) {}

// MapStruct for mapping
@Mapper(componentModel = "spring")
public interface UserMapper {
    
    UserSummaryDTO toSummary(User user);
    
    @Mapping(target = "roles", source = "roles")
    UserDetailDTO toDetail(User user);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    User toEntity(CreateUserRequest request);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateUserRequest request, @MappingTarget User user);
}

// Usage
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    public UserDetailDTO getUserById(Long id) {
        return userRepository.findById(id)
            .map(userMapper::toDetail)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }
}
```

### 7.5 API Design

```java
// RESTful API Design
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User management APIs")
public class UserController {
    
    // GET /api/v1/users - List all users
    @GetMapping
    @Operation(summary = "Get all users with pagination")
    public ResponseEntity<Page<UserSummaryDTO>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(parseSortOrders(sort)));
        return ResponseEntity.ok(userService.findAll(pageable));
    }
    
    // GET /api/v1/users/{id} - Get single user
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserDetailDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }
    
    // POST /api/v1/users - Create user
    @PostMapping
    @Operation(summary = "Create new user")
    public ResponseEntity<UserDetailDTO> createUser(
            @RequestBody @Valid CreateUserRequest request) {
        UserDetailDTO created = userService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.id())
            .toUri();
        return ResponseEntity.created(location).body(created);
    }
    
    // PUT /api/v1/users/{id} - Full update
    @PutMapping("/{id}")
    public ResponseEntity<UserDetailDTO> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }
    
    // PATCH /api/v1/users/{id} - Partial update
    @PatchMapping("/{id}")
    public ResponseEntity<UserDetailDTO> patchUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(userService.patch(id, updates));
    }
    
    // DELETE /api/v1/users/{id} - Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // Sub-resources
    // GET /api/v1/users/{id}/orders
    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findByUserId(id));
    }
}
```

### 7.6 Performance Best Practices

```java
// 1. Use connection pooling (HikariCP - default in Spring Boot)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000

// 2. Caching
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users", "products");
    }
}

@Service
public class UserService {
    
    @Cacheable(value = "users", key = "#id")
    public UserDTO findById(Long id) {
        return userRepository.findById(id)
            .map(userMapper::toDTO)
            .orElseThrow();
    }
    
    @CacheEvict(value = "users", key = "#id")
    public void update(Long id, UpdateUserRequest request) {
        // Update user
    }
    
    @CacheEvict(value = "users", allEntries = true)
    public void clearCache() {
        // Clear all users cache
    }
}

// 3. Pagination
public Page<UserDTO> findAll(Pageable pageable) {
    return userRepository.findAll(pageable).map(userMapper::toDTO);
}

// 4. Projection for specific fields
public interface UserProjection {
    Long getId();
    String getName();
}

@Query("SELECT u.id as id, u.name as name FROM User u WHERE u.status = :status")
List<UserProjection> findByStatus(@Param("status") UserStatus status);

// 5. Async processing
@Async
@Transactional
public CompletableFuture<Void> processLargeData(List<Data> data) {
    // Process in background
}

// 6. Bulk operations
@Modifying
@Query("UPDATE User u SET u.status = :status WHERE u.lastLogin < :date")
int deactivateInactiveUsers(@Param("status") UserStatus status, 
                           @Param("date") LocalDateTime date);
```

---

## 8. Coding Conventions

### 8.1 Naming Conventions

```java
// Classes - PascalCase, nouns
public class UserService {}
public class OrderController {}
public class InvalidEmailException extends RuntimeException {}

// Interfaces - PascalCase, adjectives or nouns
public interface Serializable {}
public interface UserRepository {}
public interface PaymentProcessor {}

// Methods - camelCase, verbs
public void calculateTotal() {}
public User findById(Long id) {}
public boolean isValid() {}
public void setName(String name) {}

// Variables - camelCase
private String firstName;
private int itemCount;
private boolean isActive;

// Constants - SCREAMING_SNAKE_CASE
public static final int MAX_RETRY_COUNT = 3;
public static final String DEFAULT_TIMEZONE = "UTC";

// Packages - lowercase
package com.company.project.service;
package com.company.project.repository;

// Generic types - Single uppercase letter
public class Box<T> {}
public interface Function<T, R> {}
public class Map<K, V> {}

// Boolean naming
private boolean active;      // NOT: isActive (getter will be isActive())
private boolean enabled;     // NOT: isEnabled
private boolean hasPermission; // OK for complex conditions
```

### 8.2 Code Organization

```java
// Class member ordering
public class User {
    // 1. Static constants
    public static final String TABLE_NAME = "users";
    
    // 2. Static fields
    private static int instanceCount = 0;
    
    // 3. Instance fields (public -> protected -> private)
    private Long id;
    private String name;
    
    // 4. Static blocks
    static {
        // Static initialization
    }
    
    // 5. Instance blocks
    {
        instanceCount++;
    }
    
    // 6. Constructors
    public User() {}
    public User(String name) { this.name = name; }
    
    // 7. Static methods
    public static User createDefault() {
        return new User("Default");
    }
    
    // 8. Instance methods
    public void activate() {}
    public void deactivate() {}
    
    // 9. Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    // 10. equals, hashCode, toString
    @Override
    public boolean equals(Object o) { /* ... */ }
    
    @Override
    public int hashCode() { /* ... */ }
    
    @Override
    public String toString() { /* ... */ }
}
```

### 8.3 Documentation (Javadoc)

```java
/**
 * Service class for managing user operations.
 * 
 * <p>This service provides CRUD operations for users and handles
 * business logic related to user management.</p>
 * 
 * @author John Doe
 * @version 1.0
 * @since 2024-01-01
 * @see UserRepository
 */
@Service
public class UserService {
    
    /**
     * Retrieves a user by their unique identifier.
     * 
     * @param id the unique identifier of the user (must not be null)
     * @return the user with the given id
     * @throws ResourceNotFoundException if no user is found with the given id
     * @throws IllegalArgumentException if id is null
     */
    public User findById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID must not be null");
        }
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }
    
    /**
     * Creates a new user in the system.
     * 
     * <p>The user will be created with default settings and
     * a welcome email will be sent asynchronously.</p>
     * 
     * <pre>{@code
     * CreateUserRequest request = new CreateUserRequest("John", "john@example.com");
     * User user = userService.createUser(request);
     * }</pre>
     * 
     * @param request the user creation request containing user details
     * @return the created user with generated ID
     * @throws BusinessException if email is already registered
     */
    public User createUser(CreateUserRequest request) {
        // Implementation
    }
}
```

### 8.4 Code Style

```java
// Braces - K&R style
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}

// Line length - Max 120 characters
// Break before operators
String result = longMethodName(parameter1, parameter2)
    .chainedMethod()
    .anotherChainedMethod();

// Method parameters - break after opening paren if too long
public void methodWithManyParameters(
        String parameter1,
        String parameter2,
        String parameter3,
        String parameter4) {
    // Implementation
}

// Lambda expressions
list.forEach(item -> System.out.println(item));

list.stream()
    .filter(item -> item.isActive())
    .map(item -> item.getName())
    .forEach(name -> System.out.println(name));

// Avoid magic numbers
// BAD
if (user.getAge() > 18) {}

// GOOD
private static final int MINIMUM_AGE = 18;
if (user.getAge() > MINIMUM_AGE) {}

// Early returns for clarity
public String process(User user) {
    if (user == null) {
        return null;
    }
    
    if (!user.isActive()) {
        return "inactive";
    }
    
    // Main logic here
    return user.getName();
}

// Use Optional properly
// BAD
public User findUser(Long id) {
    Optional<User> optional = repository.findById(id);
    if (optional.isPresent()) {
        return optional.get();
    }
    return null;
}

// GOOD
public Optional<User> findUser(Long id) {
    return repository.findById(id);
}

// Or
public User findUser(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User", id));
}
```

### 8.5 Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/company/project/
│   │       ├── Application.java
│   │       ├── config/
│   │       │   ├── SecurityConfig.java
│   │       │   ├── SwaggerConfig.java
│   │       │   └── CacheConfig.java
│   │       ├── controller/
│   │       │   ├── UserController.java
│   │       │   └── OrderController.java
│   │       ├── service/
│   │       │   ├── UserService.java
│   │       │   └── OrderService.java
│   │       ├── repository/
│   │       │   ├── UserRepository.java
│   │       │   └── OrderRepository.java
│   │       ├── entity/
│   │       │   ├── User.java
│   │       │   └── Order.java
│   │       ├── dto/
│   │       │   ├── request/
│   │       │   │   └── CreateUserRequest.java
│   │       │   └── response/
│   │       │       └── UserResponse.java
│   │       ├── mapper/
│   │       │   └── UserMapper.java
│   │       ├── exception/
│   │       │   ├── GlobalExceptionHandler.java
│   │       │   └── ResourceNotFoundException.java
│   │       ├── security/
│   │       │   ├── JwtUtils.java
│   │       │   └── JwtAuthFilter.java
│   │       └── util/
│   │           └── DateUtils.java
│   └── resources/
│       ├── application.yml
│       ├── application-dev.yml
│       └── application-prod.yml
└── test/
    └── java/
        └── com/company/project/
            ├── controller/
            ├── service/
            └── repository/
```

---

## 9. Tools

### 9.1 Build Tools

```xml
<!-- Maven - pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.company</groupId>
    <artifactId>my-project</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <properties>
        <java.version>21</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>

<!-- Common commands -->
<!-- mvn clean install -->
<!-- mvn spring-boot:run -->
<!-- mvn test -->
<!-- mvn package -DskipTests -->
```

```groovy
// Gradle - build.gradle.kts
plugins {
    java
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
}

group = "com.company"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// Common commands
// ./gradlew clean build
// ./gradlew bootRun
// ./gradlew test
```

### 9.2 Code Quality Tools

```xml
<!-- SpotBugs - Static analysis -->
<plugin>
    <groupId>com.github.spotbugs</groupId>
    <artifactId>spotbugs-maven-plugin</artifactId>
    <version>4.8.1.0</version>
</plugin>

<!-- Checkstyle - Code style -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.3.1</version>
    <configuration>
        <configLocation>checkstyle.xml</configLocation>
    </configuration>
</plugin>

<!-- JaCoCo - Code coverage -->
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>

<!-- SonarQube integration -->
<!-- mvn sonar:sonar -Dsonar.host.url=http://localhost:9000 -->
```

### 9.3 Development Tools

```yaml
# Docker Compose for local development
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI

volumes:
  postgres_data:
```

### 9.4 Monitoring & Observability

```java
// Spring Boot Actuator
// application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always

// Custom health indicator
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            return Health.up()
                .withDetail("database", "PostgreSQL")
                .withDetail("connection", "valid")
                .build();
        } catch (SQLException e) {
            return Health.down()
                .withException(e)
                .build();
        }
    }
}

// Micrometer metrics
@Service
public class OrderService {
    
    private final Counter orderCounter;
    private final Timer orderProcessingTimer;
    
    public OrderService(MeterRegistry registry) {
        this.orderCounter = Counter.builder("orders.created")
            .description("Number of orders created")
            .register(registry);
        
        this.orderProcessingTimer = Timer.builder("orders.processing.time")
            .description("Time to process an order")
            .register(registry);
    }
    
    public Order createOrder(OrderRequest request) {
        return orderProcessingTimer.record(() -> {
            Order order = processOrder(request);
            orderCounter.increment();
            return order;
        });
    }
}
```

### 9.5 IDE Configuration

```json
// .editorconfig
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{yml,yaml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

```xml
<!-- IntelliJ code style (export to XML) -->
<!-- File -> Settings -> Editor -> Code Style -> Java -> Import Scheme -->

<!-- Key settings:
- Tabs and Indents: 4 spaces
- Imports: No wildcards (set Class count to 999)
- Braces: K&R style
- Max line length: 120
-->
```

### 9.6 Useful Libraries

```xml
<!-- Lombok - Reduce boilerplate -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>

<!-- MapStruct - Object mapping -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>

<!-- Apache Commons -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
</dependency>

<!-- Guava -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>32.1.3-jre</version>
</dependency>

<!-- OpenAPI/Swagger -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>

<!-- Flyway - Database migrations -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

---

## Quick Reference

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 500 | Internal Server Error | Server-side error |

### Spring Annotations Cheat Sheet

| Annotation | Purpose |
|------------|---------|
| @Component | Generic Spring bean |
| @Service | Business logic layer |
| @Repository | Data access layer |
| @Controller | Web MVC controller |
| @RestController | REST API controller |
| @Configuration | Configuration class |
| @Bean | Define a bean |
| @Autowired | Dependency injection |
| @Value | Inject property value |
| @Transactional | Transaction management |
| @Async | Async execution |
| @Scheduled | Scheduled tasks |
| @Cacheable | Cache method result |
| @Valid | Enable validation |

### JPA Annotations Cheat Sheet

| Annotation | Purpose |
|------------|---------|
| @Entity | Mark as JPA entity |
| @Table | Specify table name |
| @Id | Primary key |
| @GeneratedValue | Auto-generate ID |
| @Column | Column mapping |
| @OneToMany | One-to-many relationship |
| @ManyToOne | Many-to-one relationship |
| @ManyToMany | Many-to-many relationship |
| @JoinColumn | Foreign key column |
| @Transient | Not persisted |
| @Embedded | Embedded object |
| @Query | Custom JPQL query |

---

## 10. Interview Questions & Answers

This section provides comprehensive interview questions organized by topic, covering both Mid Level (2+ years, at least 1 year with Java) and Senior Level (4+ years, at least 2 years with Java) expectations.

---

### 10.1 Java & Spring Boot

#### Q1: What is Spring Boot and how does it differ from Spring Framework?

**Answer:**

Spring Boot is essentially an opinionated layer built on top of the Spring Framework that dramatically simplifies application development. Let me explain the key differences.

With traditional Spring Framework, you have to do a lot of manual configuration. You need to set up XML or Java-based configuration files, configure your web server separately like Tomcat or JBoss, manage all your dependencies manually in Maven or Gradle, and write a lot of boilerplate code just to get a basic application running. It's powerful but can be overwhelming, especially for new projects.

Spring Boot changes all of this with its "convention over configuration" philosophy. The most important feature is **auto-configuration** - Spring Boot looks at what's on your classpath and automatically configures beans for you. For example, if you have `spring-boot-starter-data-jpa` on your classpath, it automatically configures a DataSource, EntityManagerFactory, and TransactionManager.

Another huge benefit is **starter dependencies**. Instead of figuring out which exact versions of 20 different libraries work together, you just add `spring-boot-starter-web` and it pulls in everything you need for a web application with compatible versions.

Spring Boot also gives you an **embedded server**. You don't need to deploy to an external Tomcat - your application runs as a simple JAR with `java -jar myapp.jar`. This is perfect for microservices and containerized deployments.

Here's a concrete example of the difference:

```java
// Spring Framework (traditional) - lots of configuration needed
@Configuration
@EnableWebMvc
@ComponentScan("com.example")
public class WebConfig implements WebMvcConfigurer {
    @Bean
    public ViewResolver viewResolver() {
        // Manual configuration...
    }
}

// Spring Boot (simplified) - just one annotation
@SpringBootApplication  // Combines @Configuration, @EnableAutoConfiguration, @ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

In production, I also use Spring Boot Actuator for health checks and metrics, and DevTools during development for hot reloading. These are built-in features that would require significant setup in plain Spring.

---

#### Q2: Explain Dependency Injection and its types in Spring

**Answer:**

Dependency Injection is a fundamental design pattern that's at the heart of Spring Framework. The core idea is simple: instead of a class creating its own dependencies, those dependencies are "injected" from outside. This inverts the control - hence why Spring's container is called the IoC (Inversion of Control) container.

Let me explain why this matters with a practical example. Imagine you have an OrderService that needs a UserRepository and PaymentService. Without DI, you'd write `new UserRepository()` inside OrderService. This creates tight coupling - your OrderService now directly depends on concrete implementations, making it hard to test with mocks and hard to swap implementations.

With DI, the Spring container creates all the beans and wires them together. Your OrderService simply declares what it needs, and Spring provides it.

There are three types of dependency injection in Spring:

**Constructor Injection** is what I always recommend and use in my projects. You declare dependencies as constructor parameters, typically with `final` fields. This makes dependencies explicit, ensures the object is fully initialized before use, and makes it easy to write unit tests - you just pass mocks through the constructor.

```java
@Service
public class OrderService {
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    
    // Since Spring 4.3, @Autowired is optional for single constructor
    public OrderService(UserRepository userRepository, PaymentService paymentService) {
        this.userRepository = userRepository;
        this.paymentService = paymentService;
    }
}
```

**Setter Injection** is appropriate for optional dependencies. If the dependency might not be available or needed, you can use setter injection with `@Autowired(required = false)`. The object can function without it.

```java
@Service
public class NotificationService {
    private EmailService emailService;
    
    @Autowired(required = false)  // Optional - might be null
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

**Field Injection** uses `@Autowired` directly on fields. While it's shorter to write, I avoid it because it hides dependencies, makes testing harder (you need reflection or Spring context to set those fields), and allows you to add too many dependencies without noticing the code smell.

```java
@Service
public class ProductService {
    @Autowired  // Not recommended - hidden dependency
    private ProductRepository productRepository;
}
```

The reason I prefer constructor injection is that it makes circular dependencies fail fast at startup, dependencies are immutable (final), and you can instantly see all dependencies in the constructor signature. If you find yourself with too many constructor parameters, that's a design smell indicating your class has too many responsibilities.

---

#### Q3: What are Spring Bean Scopes? When would you use each?

**Answer:**

Bean scope defines the lifecycle and visibility of a bean in the Spring container. Understanding scopes is crucial because choosing the wrong one can lead to thread-safety issues or memory leaks.

The default scope is **singleton**, which means Spring creates exactly one instance of the bean per container. This single instance is shared across all threads and all injection points. This is perfect for stateless services and repositories - they don't hold any request-specific data, so sharing one instance is efficient and safe. In fact, about 95% of beans in a typical application are singletons.

**Prototype** scope creates a new instance every time the bean is requested. I use this for stateful beans that hold data specific to a particular operation. For example, if I have a non-thread-safe parser or a bean that accumulates state during processing, prototype ensures each caller gets their own fresh instance. The important thing to remember is that Spring doesn't manage prototype beans after creation - you're responsible for cleanup.

For web applications, there are request and session scopes. **Request scope** creates one bean instance per HTTP request. I use this for storing request-specific context, like the current user's tenant ID in a multi-tenant application. When the request completes, the bean is destroyed. **Session scope** maintains one bean per user session - perfect for something like a shopping cart that persists across multiple requests but is unique per user.

```java
@Component
@Scope("singleton")  // Default - one instance shared
public class SingletonService { }

@Component
@Scope("prototype")  // New instance each injection
public class PrototypeService { }

@Component
@RequestScope  // One per HTTP request
public class RequestContext {
    private UUID requestId = UUID.randomUUID();
}

@Component
@SessionScope  // One per user session
public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
}
```

There's an important gotcha when mixing scopes. If you inject a prototype-scoped bean into a singleton, you might expect a new prototype for each method call, but that's not what happens. The prototype is injected once when the singleton is created, and you get that same instance forever. To fix this, use `ObjectFactory<T>` or `Provider<T>`:

```java
@Service  // Singleton
public class OrderService {
    // DON'T DO THIS - cart is injected once and reused!
    // @Autowired private ShoppingCart cart;
    
    // DO THIS - get a fresh cart when needed
    @Autowired
    private ObjectFactory<ShoppingCart> cartFactory;
    
    public void process() {
        ShoppingCart cart = cartFactory.getObject();  // New instance
    }
}
```

---

#### Q4: Explain Spring Boot Auto-Configuration. How does it work?

**Answer:**

Auto-configuration is what makes Spring Boot feel magical - your application just works without pages of configuration. Let me explain how this magic actually works under the hood.

When you annotate your main class with `@SpringBootApplication`, it includes `@EnableAutoConfiguration`. This tells Spring Boot to scan for auto-configuration classes and conditionally apply them. The key word here is "conditionally" - Spring Boot doesn't blindly configure everything, it makes smart decisions.

Spring Boot ships with hundreds of auto-configuration classes, each responsible for setting up a specific feature. For example, `DataSourceAutoConfiguration` sets up your database connection pool, `JacksonAutoConfiguration` configures JSON serialization, and `WebMvcAutoConfiguration` sets up Spring MVC.

The decision-making process uses conditional annotations. Let me break down a real example:

```java
@AutoConfiguration
@ConditionalOnClass(DataSource.class)  // Only runs if DataSource class exists
@ConditionalOnMissingBean(DataSource.class)  // Only if you haven't defined your own
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public DataSource dataSource(DataSourceProperties properties) {
        return DataSourceBuilder.create()
            .url(properties.getUrl())
            .username(properties.getUsername())
            .password(properties.getPassword())
            .build();
    }
}
```

This auto-configuration only activates if `DataSource.class` is on the classpath (meaning you added a database dependency), AND you haven't already defined your own DataSource bean. If you define your own, Spring Boot backs off and uses yours instead.

The most common conditional annotations are:
- `@ConditionalOnClass` - activates only when a specific class is on the classpath
- `@ConditionalOnMissingBean` - activates only when a bean doesn't already exist (this lets your custom config take precedence)
- `@ConditionalOnProperty` - activates based on properties in your configuration
- `@ConditionalOnWebApplication` - activates only when running as a web application

When something isn't working as expected, I debug auto-configuration by setting `debug: true` in `application.yml`. This prints a detailed report showing which auto-configurations were applied and which were skipped and why. It's invaluable for understanding why something isn't being configured the way you expect.

```yaml
# application.yml
debug: true  # Prints auto-configuration report at startup
```

This understanding is useful when you need to exclude an auto-configuration (`@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)`) or when creating your own starters with custom auto-configuration.

---

#### Q5: How do you handle configuration in Spring Boot for different environments?

**Answer:**

Spring Boot supports multiple configuration strategies for environment-specific settings:

**1. Profile-based Configuration:**

```yaml
# application.yml (default)
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

server:
  port: 8080

---
# application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
  jpa:
    hibernate:
      ddl-auto: create-drop

---
# application-prod.yml
spring:
  datasource:
    url: jdbc:postgresql://prod-db:5432/myapp
  jpa:
    hibernate:
      ddl-auto: validate
```

**2. @ConfigurationProperties for Type-Safe Configuration:**

```java
@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    
    @NotBlank
    private String name;
    
    @Min(1000)
    @Max(65535)
    private int port = 8080;
    
    private Security security = new Security();
    
    @Data
    public static class Security {
        private String jwtSecret;
        private Duration tokenExpiration = Duration.ofHours(24);
    }
    
    // Getters and setters
}
```

```yaml
# application.yml
app:
  name: My Application
  port: 8080
  security:
    jwt-secret: ${JWT_SECRET}
    token-expiration: 24h
```

**3. Environment Variables with Relaxed Binding:**

```bash
# These all map to app.security.jwt-secret
export APP_SECURITY_JWT_SECRET=secret
export APP_SECURITY_JWTSECRET=secret
export app.security.jwt-secret=secret
```

**4. External Configuration Priority (highest to lowest):**
1. Command line arguments
2. SPRING_APPLICATION_JSON
3. OS environment variables
4. Profile-specific application-{profile}.yml
5. application.yml
6. @PropertySource annotations
7. Default properties

---

### 10.2 OAuth2 & Security

#### Q1: Explain OAuth2 and its common grant types

**Answer:**

OAuth2 is an authorization framework - and it's important to stress "authorization" not "authentication." OAuth2 answers the question "what can this application access?" rather than "who is this user?" Let me walk through how it works.

The key insight behind OAuth2 is this: you want to let a third-party application access your data without giving it your password. Think about when you use "Sign in with Google" or allow a calendar app to access your Gmail - you don't give these apps your Google password, but they still get limited access to your data.

There are four main players in OAuth2. The **Resource Owner** is you - the user who owns the data. The **Client** is the application trying to access your data. The **Authorization Server** is Google, Facebook, or your own auth server that issues tokens. The **Resource Server** hosts the actual data you're protecting.

Now for the grant types - these define how the client gets tokens:

**Authorization Code** is the most secure and most common flow for server-side web applications. The flow works like this: your app redirects the user to the authorization server (like "Sign in with Google"), the user logs in and consents, the auth server redirects back with a one-time authorization code, and your server exchanges that code for an access token. The token exchange happens server-to-server, so the access token never touches the browser.

**Authorization Code with PKCE** (Proof Key for Code Exchange) extends this for single-page apps and mobile apps where you can't keep a client secret secure. Instead, the client generates a random code verifier, sends a hash of it in the initial request, and proves it knows the original verifier when exchanging the code. This prevents authorization code interception attacks.

**Client Credentials** is for machine-to-machine communication with no user involved. Your server authenticates with its own credentials and gets a token. I use this for internal microservices that need to call each other.

**Refresh Token** isn't really a grant type on its own but works alongside other flows. Access tokens are short-lived (typically 15-60 minutes) for security. When they expire, the refresh token (which lives longer) can be exchanged for a new access token without making the user log in again.

```
┌─────────────────────────────────────────────────────────────────┐
│                  Authorization Code Flow                         │
│                                                                  │
│  ┌──────┐     1. Auth Request      ┌─────────────────┐          │
│  │ User │─────────────────────────▶│ Authorization   │          │
│  │      │◀────────────────────────│     Server      │          │
│  └──────┘     2. Auth Code         └─────────────────┘          │
│      │                                     │                     │
│      │ 3. Auth Code                        │                     │
│      ▼                                     │                     │
│  ┌──────┐     4. Exchange Code     ┌──────┴────────┐            │
│  │Client│─────────────────────────▶│ Token Endpoint│            │
│  │      │◀────────────────────────│               │            │
│  └──────┘     5. Access Token      └───────────────┘            │
│      │                                                           │
│      │ 6. API Request + Token                                    │
│      ▼                                                           │
│  ┌──────────────┐                                                │
│  │   Resource   │                                                │
│  │    Server    │                                                │
│  └──────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

In Spring Boot, when your application acts as a Resource Server (protecting APIs), you configure JWT validation like this:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthConverter())
                )
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/api/**").authenticated()
            )
            .build();
    }
}
```

---

#### Q2: How do you implement JWT authentication in Spring Boot?

**Answer:**

JWT - JSON Web Token - is the most common token format used in modern web applications. Let me explain what it is and how I implement it.

A JWT is essentially a self-contained, signed JSON object encoded as a string. It has three parts separated by dots: Header, Payload, and Signature. The header specifies the signing algorithm (like HS256 or RS256). The payload contains claims - pieces of information like user ID, email, roles, and when the token expires. The signature verifies that the token hasn't been tampered with.

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U
│          Header        │         Payload         │              Signature                │
```

What makes JWT powerful for authentication is that it's **stateless**. The server doesn't need to store session data or query a database to validate tokens - all the necessary information is in the token itself. The server just verifies the signature using a secret key or public key.

Here's how I implement JWT authentication in Spring Boot. First, I create a JwtTokenProvider that handles token generation and validation:

```java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    
    private final JwtProperties jwtProperties;
    
    public String generateAccessToken(UserPrincipal user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getAccessTokenExpiration());
        
        return Jwts.builder()
            .setSubject(user.getId().toString())
            .claim("email", user.getEmail())
            .claim("roles", user.getRoles())
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }
}
```

Next, I create a filter that intercepts every request, extracts the token from the Authorization header, validates it, and sets up Spring Security's authentication context:

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String token = extractToken(request);
        
        if (token != null && tokenProvider.validateToken(token)) {
            String userId = tokenProvider.getUserIdFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
            
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
```

For token refresh, I use a separate refresh token with a longer expiration. When the access token expires, the client sends the refresh token to get a new access token without requiring the user to log in again. I store refresh tokens in the database so they can be revoked if needed (unlike access tokens which are stateless):

```java
public TokenResponse refreshAccessToken(String refreshToken) {
    if (!tokenProvider.validateToken(refreshToken)) {
        throw new InvalidTokenException("Invalid refresh token");
    }
    
    RefreshToken storedToken = refreshTokenRepository
        .findByToken(refreshToken)
        .orElseThrow(() -> new InvalidTokenException("Token not found"));
    
    if (storedToken.isRevoked()) {
        throw new InvalidTokenException("Token has been revoked");
    }
    
    // Generate new tokens
    UserPrincipal user = loadUserById(storedToken.getUserId());
    String newAccessToken = tokenProvider.generateAccessToken(user);
    
    return new TokenResponse(newAccessToken, refreshToken);
}
```

---
            .setExpiration(expiry)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public String generateRefreshToken(UserPrincipal user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getRefreshTokenExpiration());
        
        return Jwts.builder()
            .setSubject(user.getId().toString())
            .claim("type", "refresh")
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

// 2. JWT Authentication Filter
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String token = extractToken(request);
        
        if (token != null && tokenProvider.validateToken(token)) {
            String userId = tokenProvider.getUserIdFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
            
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}

// 3. Security Configuration
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

**Token Refresh Strategy:**

```java
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    
    public TokenResponse refreshAccessToken(String refreshToken) {
        // 1. Validate refresh token
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException("Invalid refresh token");
        }
        
        // 2. Check if token is in database and not revoked
        RefreshToken storedToken = refreshTokenRepository
            .findByToken(refreshToken)
            .orElseThrow(() -> new InvalidTokenException("Token not found"));
        
        if (storedToken.isRevoked()) {
            throw new InvalidTokenException("Token has been revoked");
        }
        
        // 3. Generate new access token
        UserPrincipal user = loadUserById(storedToken.getUserId());
        String newAccessToken = tokenProvider.generateAccessToken(user);
        
        // 4. Optionally rotate refresh token
        String newRefreshToken = tokenProvider.generateRefreshToken(user);
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);
        refreshTokenRepository.save(new RefreshToken(newRefreshToken, user.getId()));
        
        return new TokenResponse(newAccessToken, newRefreshToken);
    }
}
```

---

#### Q3: What is the difference between @PreAuthorize and @Secured?

**Answer:**

Both annotations provide method-level security in Spring, but they differ significantly in power and flexibility. Let me explain when I use each one.

**@Secured** is the simpler, older annotation. It only supports role-based checks with string literals - you specify which roles are allowed to access a method, and that's it. It's fast to write for simple cases like "only admins can delete users." However, you can't access method parameters, you can't write complex conditions, and you can't use any expressions.

**@PreAuthorize** is what I use in most production code because it supports Spring Expression Language (SpEL). This opens up powerful capabilities: I can access method arguments to check ownership, combine conditions with AND/OR logic, call custom methods, and much more.

Here's a concrete example of the difference. With `@Secured`, I can say "only admins or managers can cancel orders":

```java
@Secured({"ROLE_ADMIN", "ROLE_MANAGER"})
public void cancelOrder(Long orderId) { }
```

But what if I want to allow users to view their OWN orders, not everyone's? With `@Secured`, I can't do that. With `@PreAuthorize`, I can:

```java
// Users can only view their own orders, admins can view any
@PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
public List<Order> getUserOrders(Long userId) { }
```

The `#userId` accesses the method parameter, and `authentication.principal.id` gets the current user's ID from the security context. This kind of expression is impossible with `@Secured`.

I also use **@PostAuthorize** when I need to check the returned data. For example, I might load an order and only allow access if it belongs to the current user:

```java
@PostAuthorize("returnObject.userId == authentication.principal.id or hasRole('ADMIN')")
public Order findOrder(Long orderId) {
    return orderRepository.findById(orderId).orElseThrow();
}
```

And **@PostFilter** is useful for filtering collections. It lets each item through only if it passes the check:

```java
// Show DRAFT orders only to their owners
@PostFilter("filterObject.status != 'DRAFT' or filterObject.userId == authentication.principal.id")
public List<Order> getAllOrders() {
    return orderRepository.findAll();
}
```

To enable these annotations, you need `@EnableMethodSecurity` on a configuration class. For `@PreAuthorize`, it's enabled by default. For `@Secured`, you need to explicitly enable it with `@EnableMethodSecurity(securedEnabled = true)`.

My recommendation: use `@PreAuthorize` by default. It handles simple cases just as easily as `@Secured` (like `@PreAuthorize("hasRole('ADMIN')")`), but gives you the flexibility to handle complex authorization rules when you need them.

---

### 10.3 REST API Design & Implementation

#### Q1: What are REST API design best practices?

**Answer:**

REST API design is about creating intuitive, consistent, and maintainable interfaces. After building many APIs, I've developed strong opinions on what works well.

**Resource Naming** is fundamental. URLs should represent resources (nouns), not actions (verbs). The HTTP method already indicates the action. For example, `GET /api/v1/users` retrieves users, `POST /api/v1/users` creates a user. Never use URLs like `/api/v1/getUsers` or `/api/v1/createUser` - that's putting the verb in the URL when HTTP already provides it.

```
✅ GET /api/v1/users              # Get all users
✅ GET /api/v1/users/{id}         # Get one user
✅ GET /api/v1/users/{id}/orders  # Get user's orders (sub-resource)
✅ POST /api/v1/users             # Create user
✅ PUT /api/v1/users/{id}         # Replace entire user
✅ PATCH /api/v1/users/{id}       # Partial update
✅ DELETE /api/v1/users/{id}      # Delete user

❌ GET /api/v1/getUsers           # Verb in URL
❌ POST /api/v1/createUser        # Action in URL
❌ GET /api/v1/user               # Singular for collection
```

**HTTP Methods** communicate intent. GET retrieves data and should be safe (no side effects) and idempotent (same result each time). POST creates new resources and is neither safe nor idempotent. PUT replaces an entire resource and is idempotent - calling it multiple times has the same effect as calling it once. PATCH does partial updates. DELETE removes resources and should be idempotent.

**Status Codes** tell the client what happened. I use 200 for successful GET/PUT/PATCH, 201 for successful POST (resource created), 204 for successful DELETE (no content to return). For errors: 400 means the client sent bad data (validation error), 401 means the request lacks authentication, 403 means authentication succeeded but the user doesn't have permission, 404 means the resource doesn't exist, 409 means there's a conflict (like duplicate email), and 500 means something unexpected broke on the server.

**Pagination** is essential for large collections. I use query parameters: `GET /api/v1/products?page=0&size=20&sort=price,desc`. The response includes not just the data but metadata about the pagination:

```java
@GetMapping
public ResponseEntity<Page<ProductDTO>> getProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
    
    Pageable pageable = PageRequest.of(page, size, parseSort(sort));
    Page<Product> products = productRepository.findAll(pageable);
    return ResponseEntity.ok(products.map(ProductDTO::from));
}
```

**Error Responses** should be consistent and informative. I always return the same error structure so clients can handle errors predictably:

```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "path": "/api/v1/users",
    "validationErrors": {
        "email": "must be a valid email",
        "password": "must be at least 8 characters"
    }
}
```

**Versioning** prepares you for the future. I use URL path versioning (`/api/v1/users`, `/api/v2/users`) because it's explicit, cache-friendly, and easy to route. Some prefer header versioning for cleaner URLs, but I find path versioning more practical for documentation and debugging.

---| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Retrieve | Yes | Yes |
| POST | Create | No | No |
| PUT | Full update | Yes | No |
| PATCH | Partial update | No | No |
| DELETE | Remove | Yes | No |

**3. Status Codes:**

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Business rule violation |
| 500 | Internal Server Error | Unexpected error |

**4. Pagination, Filtering, Sorting:**

```java
// GET /api/v1/products?page=0&size=20&sort=price,desc&category=electronics&minPrice=100

@GetMapping
public ResponseEntity<Page<ProductDTO>> getProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt,desc") String[] sort,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice) {
    
    Pageable pageable = PageRequest.of(page, size, parseSort(sort));
    Specification<Product> spec = ProductSpecification.withFilters(category, minPrice, maxPrice);
    
    Page<Product> products = productRepository.findAll(spec, pageable);
    return ResponseEntity.ok(products.map(ProductDTO::from));
}

// Response with pagination metadata
{
    "content": [...],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "first": true,
    "last": false
}
```

**5. Error Response Format:**

```java
@Data
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;
}

// Example response
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "path": "/api/v1/users",
    "validationErrors": {
        "email": "must be a valid email",
        "password": "must be at least 8 characters"
    }
}
```

**6. Versioning:**

```java
// URL versioning (recommended)
@RequestMapping("/api/v1/users")
@RequestMapping("/api/v2/users")

// Header versioning
@GetMapping(headers = "X-API-Version=1")
@GetMapping(headers = "X-API-Version=2")

// Content negotiation
@GetMapping(produces = "application/vnd.myapi.v1+json")
```

---

#### Q2: How do you handle validation in REST APIs?

**Answer:**

**Bean Validation Annotations:**

```java
public class CreateUserRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
             message = "Password must contain uppercase, lowercase, and digit")
    private String password;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Must be at least 18")
    @Max(value = 120, message = "Invalid age")
    private Integer age;
    
    @Valid  // Nested validation
    @NotNull
    private AddressDTO address;
}

// Custom validator
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    
    private final UserRepository userRepository;
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return email != null && !userRepository.existsByEmail(email);
    }
}
```

**Controller with Validation:**

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        // @Valid triggers validation, throws MethodArgumentNotValidException if fails
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(userService.create(request));
    }
}

// Global exception handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value"
            ));
        
        return ResponseEntity.badRequest().body(ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(400)
            .error("Validation Failed")
            .validationErrors(errors)
            .build());
    }
}
```

---

#### Q3: How do you implement idempotency in REST APIs?

**Answer:**

Idempotency ensures that multiple identical requests have the same effect as a single request.

**Why it matters:** Network failures can cause request retries, leading to duplicate operations.

```java
// Idempotency Key Implementation
@Service
@RequiredArgsConstructor
public class IdempotencyService {
    
    private final RedisTemplate<String, String> redisTemplate;
    private static final Duration TTL = Duration.ofHours(24);
    
    public <T> T executeIdempotent(String idempotencyKey, Supplier<T> operation) {
        String cacheKey = "idempotency:" + idempotencyKey;
        
        // Check if request was already processed
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return deserialize(cached);  // Return cached response
        }
        
        // Process request
        T result = operation.get();
        
        // Cache the response
        redisTemplate.opsForValue().set(cacheKey, serialize(result), TTL);
        
        return result;
    }
    
    public boolean isProcessed(String idempotencyKey) {
        return redisTemplate.hasKey("idempotency:" + idempotencyKey);
    }
}

// Controller usage
@PostMapping("/payments")
public ResponseEntity<PaymentResponse> createPayment(
        @RequestHeader("Idempotency-Key") String idempotencyKey,
        @Valid @RequestBody CreatePaymentRequest request) {
    
    PaymentResponse response = idempotencyService.executeIdempotent(
        idempotencyKey,
        () -> paymentService.process(request)
    );
    
    return ResponseEntity.ok(response);
}

// Client usage:
// POST /api/payments
// Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
// 
// Retry with same Idempotency-Key returns cached response
```

---

### 10.4 API Versioning

#### Q1: What are the different API versioning strategies? When would you use each?

**Answer:**

API versioning is inevitable - requirements change, and you'll eventually need to make breaking changes while maintaining backward compatibility for existing clients. The question is how to version, and I've used several strategies.

**URL Path Versioning** (`/api/v1/users`, `/api/v2/users`) is what I use most often and recommend for most teams. The version is right there in the URL - explicit and impossible to miss. It's easy to document, easy to test (just change the URL), and plays well with caching and CDNs since different versions have different URLs. The downside is that technically it changes the resource identity (the URL) when the resource itself hasn't changed, but in practice this rarely matters.

**Query Parameter Versioning** (`/api/users?version=1`) keeps the URL stable while the version is optional. This means if a client forgets the version parameter, they get... what? Usually the latest version, which can be a breaking surprise. I've seen this cause issues in production when clients didn't realize they needed to specify a version.

**Header Versioning** (`X-API-Version: 1` or `Accept: application/vnd.api.v1+json`) keeps URLs clean and is arguably the most RESTful - the resource URL stays consistent regardless of representation. But it's hidden - you can't see the version in a browser URL bar, API documentation is messier, and it's harder to test with simple tools. In my experience, the elegance isn't worth the practical friction.

Here's how I implement URL path versioning - it's straightforward:

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 {
    @GetMapping("/{id}")
    public UserResponseV1 getUser(@PathVariable Long id) {
        return new UserResponseV1(user.getId(), user.getName());
    }
}

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
    @GetMapping("/{id}")
    public UserResponseV2 getUser(@PathVariable Long id) {
        // V2 includes additional fields
        return new UserResponseV2(user.getId(), user.getName(), 
            user.getEmail(), user.getCreatedAt());
    }
}
```

When deprecating an old version, I use standard HTTP headers to give clients warning:

```java
@GetMapping("/{id}")
public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    UserResponse response = userService.findById(id);
    
    return ResponseEntity.ok()
        .header("Deprecation", "true")
        .header("Sunset", "2024-12-31")  // When it will be removed
        .header("Link", "</api/v2/users/" + id + ">; rel=\"successor\"")
        .body(response);
}
```

The Deprecation header signals the version is deprecated, Sunset tells when it will be removed, and Link points to the replacement. This gives clients time to migrate without breaking them immediately.

---

### 10.5 API Rate Limiting

#### Q1: How do you implement rate limiting? What algorithms exist?

**Answer:**

Rate limiting protects your API from abuse and ensures fair resource usage. Without it, a single misbehaving client can overwhelm your servers and impact everyone else. I'll explain the main algorithms and how I implement them.

**Token Bucket** is my go-to algorithm. Imagine a bucket that holds tokens, with new tokens added at a fixed rate. Each request consumes one token. If the bucket is empty, the request is rejected. The key feature is that the bucket can accumulate tokens up to a maximum, allowing controlled burst traffic. If a user is quiet for a while, they build up tokens and can make several quick requests - this matches real usage patterns well.

**Leaky Bucket** processes requests at a fixed rate, like water leaking from a bucket at a constant drip. Requests queue up and are processed in order. This produces very smooth output, which is great when you need predictable load on downstream services, but it doesn't handle burst traffic well - users can't speed up even if they've been quiet.

**Fixed Window** counts requests in fixed time intervals (like per minute). Simple to implement, but has a boundary problem: a user could make 100 requests at 11:59 and 100 more at 12:00, effectively making 200 requests in two seconds around the window boundary.

**Sliding Window** fixes the boundary issue by using a rolling time window. Each request is timestamped, and at any moment you count requests in the past 60 seconds (for example). More accurate but requires storing timestamps, which uses more memory.

For most applications, I use Token Bucket via Redis for distributed rate limiting:

```java
@Component
@RequiredArgsConstructor
public class RateLimiter {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    public boolean isAllowed(String key, int limit, int windowSeconds) {
        String redisKey = "rate_limit:" + key;
        long now = System.currentTimeMillis();
        long windowStart = now - (windowSeconds * 1000L);
        
        return redisTemplate.execute(new SessionCallback<Boolean>() {
            @Override
            public Boolean execute(RedisOperations operations) {
                operations.multi();
                
                // Remove expired entries
                operations.opsForZSet().removeRangeByScore(redisKey, 0, windowStart);
                
                // Count current requests
                operations.opsForZSet().count(redisKey, windowStart, now);
                
                // Add this request
                operations.opsForZSet().add(redisKey, String.valueOf(now), now);
                
                // Set expiry to auto-cleanup
                operations.expire(redisKey, Duration.ofSeconds(windowSeconds));
                
                List<Object> results = operations.exec();
                Long count = (Long) results.get(1);
                
                return count < limit;
            }
        });
    }
}
```

In the response, I always include rate limit headers so clients know their status:

```
X-RateLimit-Limit: 100      # Allowed requests per window
X-RateLimit-Remaining: 57   # Requests left in current window
X-RateLimit-Reset: 1642000000  # Unix timestamp when window resets
```

When the limit is exceeded, I return HTTP 429 Too Many Requests with a Retry-After header telling the client when to try again. This helps well-behaved clients back off gracefully.

---            @Override
            @SuppressWarnings("unchecked")
            public Boolean execute(RedisOperations operations) {
                operations.multi();
                
                // Remove old entries
                operations.opsForZSet().removeRangeByScore(redisKey, 0, windowStart);
                
                // Count current requests
                operations.opsForZSet().count(redisKey, windowStart, now);
                
                // Add current request
                operations.opsForZSet().add(redisKey, String.valueOf(now), now);
                
                // Set expiry
                operations.expire(redisKey, Duration.ofSeconds(windowSeconds));
                
                List<Object> results = operations.exec();
                Long count = (Long) results.get(1);
                
                return count < limit;
            }
        });
    }
    
    public int getRemainingRequests(String key, int limit, int windowSeconds) {
        String redisKey = "rate_limit:" + key;
        long now = System.currentTimeMillis();
        long windowStart = now - (windowSeconds * 1000L);
        
        Long count = redisTemplate.opsForZSet().count(redisKey, windowStart, now);
        return Math.max(0, limit - (count != null ? count.intValue() : 0));
    }
}

// Rate Limiting Filter
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {
    
    private final RateLimiter rateLimiter;
    
    private static final int USER_LIMIT = 100;      // 100 requests
    private static final int WINDOW_SECONDS = 60;   // per minute
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        
        String userId = extractUserId(request);
        String key = userId != null ? "user:" + userId : "ip:" + request.getRemoteAddr();
        
        if (!rateLimiter.isAllowed(key, USER_LIMIT, WINDOW_SECONDS)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"error\": \"Rate limit exceeded. Try again later.\"}");
            return;
        }
        
        // Add rate limit headers
        int remaining = rateLimiter.getRemainingRequests(key, USER_LIMIT, WINDOW_SECONDS);
        response.addHeader("X-RateLimit-Limit", String.valueOf(USER_LIMIT));
        response.addHeader("X-RateLimit-Remaining", String.valueOf(remaining));
        response.addHeader("X-RateLimit-Reset", String.valueOf(
            Instant.now().plusSeconds(WINDOW_SECONDS).getEpochSecond()));
        
        chain.doFilter(request, response);
    }
}
```

---

### 10.6 Circuit Breaker

#### Q1: What is the Circuit Breaker pattern? How do you implement it?

**Answer:**

The Circuit Breaker pattern is how I protect my application from cascading failures when calling external services. Think of it like an electrical circuit breaker - when too many failures occur, it "trips" to prevent further damage.

Here's the scenario: my Payment Service calls an external payment gateway. If that gateway goes down or becomes slow, every request to my service will wait (consuming threads), eventually exhausting my application's resources. Even services that don't use the payment gateway might become unavailable because there are no threads left to serve them. The whole system cascades into failure from one misbehaving dependency.

A Circuit Breaker monitors calls to the external service and has three states:

**CLOSED** (normal operation): All requests pass through. The breaker monitors the failure rate. Everything works as expected.

**OPEN** (failures exceeded threshold): After too many failures (say 50% of the last 10 calls), the breaker trips. Now all requests fail immediately without even calling the external service. This gives the failing service time to recover while freeing up my application's resources.

**HALF-OPEN** (testing recovery): After a wait period (say 30 seconds), the breaker lets a few test requests through. If they succeed, the breaker closes and normal operation resumes. If they fail, it stays open.

```
┌───────────────────────────────────────────────────────────────────┐
│   CLOSED ────[failures > 50%]────▶ OPEN                           │
│     ▲                                │                            │
│     │                                │ (wait 30s)                 │
│     │                                ▼                            │
│     └──────[success]────────── HALF-OPEN ──[failure]──┐           │
│                                                        │          │
│                                                        └──▶ OPEN  │
└───────────────────────────────────────────────────────────────────┘
```

I use Resilience4j for implementation because it's lightweight and designed for Spring Boot:

```yaml
resilience4j:
  circuitbreaker:
    instances:
      paymentService:
        slidingWindowSize: 10              # Monitor last 10 calls
        failureRateThreshold: 50           # Open when 50% fail
        slowCallRateThreshold: 100         # Also count slow calls
        slowCallDurationThreshold: 2s      # What counts as "slow"
        waitDurationInOpenState: 30s       # How long before trying again
        permittedNumberOfCallsInHalfOpenState: 3  # Test with 3 calls
```

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    private final PaymentGatewayClient client;
    
    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    @Retry(name = "paymentService")        // Retry transient failures
    @TimeLimiter(name = "paymentService")  // Timeout slow calls
    public CompletableFuture<PaymentResponse> processPayment(PaymentRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("Processing payment for order: {}", request.getOrderId());
            return client.charge(request);
        });
    }
    
    // Fallback is called when circuit is OPEN or call fails
    public CompletableFuture<PaymentResponse> paymentFallback(
            PaymentRequest request, Throwable throwable) {
        log.warn("Payment service unavailable: {}", throwable.getMessage());
        
        // I can: return cached/default response, queue for retry later,
        // use backup provider, or return pending status
        return CompletableFuture.completedFuture(
            PaymentResponse.builder()
                .status(PaymentStatus.PENDING)
                .message("Payment queued for processing")
                .build()
        );
    }
}
```

The key insight is that failing fast is better than failing slow. When the circuit is open, users get instant feedback ("payment temporarily unavailable") instead of waiting 30 seconds for a timeout. And my application stays responsive for other operations.
```

---

### 10.7 Retries, Timeouts, Bulkheads

#### Q1: How do you implement retry with exponential backoff?

**Answer:**

Retries handle transient failures - those brief network hiccups or temporary service unavailability that resolve themselves. But naive retries (retry immediately, forever) can make things worse. If a service is struggling, hammering it with retries prevents recovery. That's why I use exponential backoff with jitter.

**Exponential backoff** means each retry waits longer than the previous one. Instead of retry immediately, then immediately, then immediately, you wait 1 second, then 2 seconds, then 4 seconds. This gives the failing service breathing room to recover.

**Jitter** adds randomness to the delay. Without jitter, if 100 clients all fail at the same time, they'll all retry at exactly the same time (after 1 second), causing a "thundering herd" that overwhelms the service again. Adding ±30% randomness spreads out the retries.

Here's my configuration with Resilience4j:

```yaml
resilience4j:
  retry:
    instances:
      externalApi:
        maxAttempts: 3                     # Total tries including first attempt
        waitDuration: 1s                   # Base delay
        enableExponentialBackoff: true
        exponentialBackoffMultiplier: 2   # Delays: 1s, 2s, 4s
        retryExceptions:
          - java.io.IOException            # Network errors - worth retrying
          - java.net.SocketTimeoutException
        ignoreExceptions:
          - com.example.BusinessException  # Don't retry business logic failures
```

When I need more control (or want to understand what's happening under the hood), I implement it manually:

```java
@Component
public class RetryableHttpClient {
    
    private static final int MAX_RETRIES = 3;
    private static final long BASE_DELAY_MS = 1000;
    private static final double JITTER_FACTOR = 0.3;
    
    public <T> T executeWithRetry(Supplier<T> operation) {
        int attempt = 0;
        Exception lastException = null;
        
        while (attempt < MAX_RETRIES) {
            try {
                return operation.get();
            } catch (RetryableException e) {
                lastException = e;
                attempt++;
                
                if (attempt < MAX_RETRIES) {
                    long delay = calculateBackoffWithJitter(attempt);
                    log.warn("Request failed, retrying in {}ms (attempt {}/{})", 
                        delay, attempt, MAX_RETRIES);
                    sleep(delay);
                }
            }
        }
        
        throw new MaxRetriesExceededException("Max retries exceeded", lastException);
    }
    
    private long calculateBackoffWithJitter(int attempt) {
        // Exponential: 1000ms, 2000ms, 4000ms...
        long exponentialDelay = (long) (BASE_DELAY_MS * Math.pow(2, attempt - 1));
        
        // Add jitter: ±30% of the delay (spreads out retry storms)
        double jitter = (Math.random() - 0.5) * 2 * JITTER_FACTOR;
        long jitterDelay = (long) (exponentialDelay * (1 + jitter));
        
        // Cap at 30 seconds - don't wait forever
        return Math.min(jitterDelay, 30_000);
    }
}
```

The key decision is what to retry. Network timeouts and connection errors? Yes, retry. 404 Not Found? No, retrying won't make the resource appear. 400 Bad Request? No, the request is malformed. 503 Service Unavailable? Yes, the service might recover. Be intentional about which exceptions trigger retries.

---

#### Q2: What is the Bulkhead pattern? When would you use it?

**Answer:**

The Bulkhead pattern is named after ship compartments - if one compartment floods, watertight doors prevent the whole ship from sinking. In software, it means isolating failures so one misbehaving component can't take down everything else.

Here's a real scenario I've dealt with. My application calls three external services: Inventory, Payment, and Notification. They share a connection pool of 100 threads. If the Notification service becomes slow (taking 30 seconds per request instead of 100ms), requests pile up. Soon 80 of my 100 threads are stuck waiting for Notification. Now even Inventory and Payment calls fail - not because those services are down, but because my application has no threads available to call them. One slow dependency has cascaded into total failure.

```
Without Bulkhead:
┌─────────────────────────────────────────────────────────────┐
│              Shared Thread Pool (100 threads)               │
│                                                             │
│   Inventory   Payment    Notification (SLOW - using 80!)   │
│   Can't get   Can't get  ← All threads consumed here       │
│   threads!    threads!                                      │
└─────────────────────────────────────────────────────────────┘
```

With bulkheads, I give each service its own isolated pool:

```
With Bulkhead:
┌────────────┐  ┌────────────┐  ┌────────────────────┐
│ Inventory  │  │  Payment   │  │   Notification     │
│ Pool (30)  │  │ Pool (30)  │  │   Pool (40)        │
│ Working ✓  │  │ Working ✓  │  │   Slow/Failing ✗   │
└────────────┘  └────────────┘  └────────────────────┘
```

Notification being slow only affects its 40 threads. Inventory and Payment continue working fine with their dedicated resources.

There are two types of bulkheads in Resilience4j:

**Semaphore Bulkhead** limits concurrent calls (like a counting semaphore). Simpler and lighter, but calls run on the calling thread.

**Thread Pool Bulkhead** runs calls in a dedicated thread pool. Better isolation, but adds overhead. Use this when you need strong isolation and async execution.

```yaml
resilience4j:
  bulkhead:
    instances:
      inventoryService:
        maxConcurrentCalls: 25       # Max 25 concurrent calls
        maxWaitDuration: 500ms       # Wait at most 500ms for a permit
        
  thread-pool-bulkhead:
    instances:
      notificationService:
        maxThreadPoolSize: 10        # 10 dedicated threads
        coreThreadPoolSize: 5
        queueCapacity: 50            # Can queue 50 more when pool is full
```

```java
@Service
public class OrderService {
    
    @Bulkhead(name = "inventoryService", type = Bulkhead.Type.SEMAPHORE)
    public InventoryResponse checkInventory(String productId) {
        return inventoryClient.check(productId);  // Limited to 25 concurrent
    }
    
    @Bulkhead(name = "notificationService", type = Bulkhead.Type.THREADPOOL,
              fallbackMethod = "notificationFallback")
    public CompletableFuture<Void> sendNotification(String userId, String message) {
        return CompletableFuture.runAsync(() -> 
            notificationClient.send(userId, message));
    }
    
    public CompletableFuture<Void> notificationFallback(String userId, 
            String message, BulkheadFullException ex) {
        log.warn("Notification bulkhead full, queueing for later");
        notificationQueue.add(new PendingNotification(userId, message));
        return CompletableFuture.completedFuture(null);
    }
}
```

---

### 10.8 Caching (Redis, In-Memory)

#### Q1: What caching patterns exist? When would you use each?

**Answer:**

Caching is one of the most impactful performance optimizations, but choosing the right pattern is crucial. Let me explain the main patterns and when I use each.

**Cache-Aside (Lazy Loading)** is what I use in most applications. The application code explicitly manages the cache: first check the cache, if it's a miss, query the database, then populate the cache. This gives you full control and works well when reads far outnumber writes, which is typical for product catalogs, user profiles, and similar read-heavy data.

The flow is straightforward:
1. Application checks cache for data
2. On cache hit, return cached data (fast path)
3. On cache miss, query database
4. Store result in cache with a TTL
5. Return data to caller

**Read-Through** is similar but the cache itself is responsible for loading data. You configure the cache with a loader function, and when there's a miss, the cache automatically fetches from the database. This simplifies application code - you just call cache.get(key) and the cache handles misses internally. I use this with Caffeine or Guava cache for in-memory caching.

**Write-Through** writes data to both the cache and database synchronously. When you update data, it goes to the cache and database together. This ensures cache consistency at the cost of write latency (you wait for both to complete). I use this when data consistency is critical and reads are frequent.

**Write-Behind (Write-Back)** writes to the cache immediately but updates the database asynchronously in the background. This is fast for writes but risky - if the server crashes before the database is updated, you lose data. I only use this for non-critical data where write performance matters more than durability, like view counts or analytics.

**Refresh-Ahead** proactively refreshes cached data before it expires, typically when it's accessed near expiration. This prevents any users from experiencing cache misses. It's great for predictable high-traffic data like a homepage banner, but adds complexity and background load.

For most Spring Boot applications, I use Cache-Aside with either Spring's `@Cacheable` for simplicity or manual Redis operations for more control:

```java
@Service
public class ProductService {
    
    // Using @Cacheable - Spring handles the pattern automatically
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public Product getProduct(Long id) {
        // Only called on cache miss
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
    
    // Manual approach when you need more control
    public Product getProductManual(Long id) {
        String cacheKey = "product:" + id;
        
        // 1. Try cache first
        Product cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;  // Cache hit - fast path
        }
        
        // 2. Cache miss - fetch from DB
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Not found"));
        
        // 3. Populate cache with TTL
        redisTemplate.opsForValue().set(cacheKey, product, Duration.ofHours(1));
        
        return product;
    }
    
    // Update cache when data changes
    @CachePut(value = "products", key = "#result.id")
    public Product updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setName(request.getName());
        return productRepository.save(product);  // Returns updated product, which caches it
    }
    
    // Invalidate cache when data is deleted
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
```

The key trade-off is consistency vs performance. Cache-Aside with TTL gives eventual consistency - data might be stale for up to the TTL duration. For most cases, a 5-15 minute TTL is acceptable, but for inventory counts or financial data, you need Write-Through or immediate invalidation.

---        
        return productRepository.save(product);  // Updates cache with returned value
    }
    
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    @CacheEvict(value = "products", allEntries = true)
    public void clearProductCache() {
        log.info("Clearing all product cache");
    }
}
```

#### Q2: How do you handle cache invalidation?

**Answer:**

```java
@Service
@RequiredArgsConstructor
public class CacheInvalidationService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApplicationEventPublisher eventPublisher;
    
    // 1. TIME-BASED EXPIRATION (TTL)
    public void cacheWithTTL(String key, Object value, Duration ttl) {
        redisTemplate.opsForValue().set(key, value, ttl);
    }
    
    // 2. EVENT-DRIVEN INVALIDATION
    @EventListener
    @Async
    public void onProductUpdated(ProductUpdatedEvent event) {
        String cacheKey = "product:" + event.getProductId();
        redisTemplate.delete(cacheKey);
        
        // Also invalidate related caches
        redisTemplate.delete("category:" + event.getCategoryId() + ":products");
        redisTemplate.delete("search:products:*");  // Pattern delete
    }
    
    // 3. WRITE-THROUGH (Update cache on write)
    @Transactional
    public Product updateProductWriteThrough(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Not found"));
        
        product.setName(request.getName());
        Product saved = productRepository.save(product);
        
        // Immediately update cache
        redisTemplate.opsForValue().set("product:" + id, saved, Duration.ofHours(1));
        
        return saved;
    }
    
    // 4. PATTERN-BASED INVALIDATION
    public void invalidatePattern(String pattern) {
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
    
    // 5. CACHE STAMPEDE PREVENTION (Locking)
    public Product getWithLock(Long id) {
        String cacheKey = "product:" + id;
        String lockKey = "lock:" + cacheKey;
        
        Product cached = (Product) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        
        // Try to acquire lock
        Boolean acquired = redisTemplate.opsForValue()
            .setIfAbsent(lockKey, "locked", Duration.ofSeconds(5));
        
        if (Boolean.TRUE.equals(acquired)) {
            try {
                // Double-check after acquiring lock
                cached = (Product) redisTemplate.opsForValue().get(cacheKey);
                if (cached != null) {
                    return cached;
                }
                
                // Fetch and cache
                Product product = productRepository.findById(id).orElseThrow();
                redisTemplate.opsForValue().set(cacheKey, product, Duration.ofHours(1));
                return product;
            } finally {
                redisTemplate.delete(lockKey);
            }
        } else {
            // Wait and retry
            sleep(100);
            return getWithLock(id);
        }
    }
}
```

---

### 10.9 Connection Pooling & DB Performance

#### Q1: What is JDBC? How does it differ from ODBC?

**Answer:**

**JDBC (Java Database Connectivity)** is Java's standard API for connecting to relational databases. **ODBC (Open Database Connectivity)** is a language-agnostic standard (primarily used with C/C++) for database access.

```
┌─────────────────────────────────────────────────────────────┐
│                    JDBC Architecture                         │
│                                                              │
│  ┌────────────────┐                                         │
│  │ Java Application│                                         │
│  └───────┬────────┘                                         │
│          │                                                   │
│          ▼                                                   │
│  ┌────────────────┐                                         │
│  │   JDBC API     │  (java.sql.*, javax.sql.*)              │
│  └───────┬────────┘                                         │
│          │                                                   │
│          ▼                                                   │
│  ┌────────────────┐                                         │
│  │ JDBC Driver    │  (Type 4: Pure Java, most common)       │
│  │ (PostgreSQL,   │                                         │
│  │  MySQL, etc.)  │                                         │
│  └───────┬────────┘                                         │
│          │                                                   │
│          ▼                                                   │
│  ┌────────────────┐                                         │
│  │   Database     │                                         │
│  └────────────────┘                                         │
└─────────────────────────────────────────────────────────────┘
```

**JDBC vs ODBC Comparison:**

| Aspect | JDBC | ODBC |
|--------|------|------|
| **Language** | Java only | Language-agnostic (C/C++, etc.) |
| **Platform** | Platform-independent (JVM) | Platform-dependent |
| **Driver** | Pure Java (Type 4) | Native libraries required |
| **Performance** | Fast (no JNI overhead in Type 4) | Fast (native code) |
| **Portability** | Write once, run anywhere | Requires recompilation |
| **Memory** | Managed by JVM | Manual memory management |
| **Security** | Type-safe | Prone to buffer overflows |

**JDBC Driver Types:**

| Type | Name | Description | Use Case |
|------|------|-------------|----------|
| Type 1 | JDBC-ODBC Bridge | Uses ODBC driver | Legacy (deprecated) |
| Type 2 | Native-API | Uses native client libs | Performance-critical |
| Type 3 | Network Protocol | Middleware server | Applets (rare) |
| **Type 4** | **Pure Java** | **Direct to DB protocol** | **Most common today** |

**Basic JDBC Usage:**

```java
// 1. Raw JDBC (low-level, verbose)
public User findById(Long id) {
    String sql = "SELECT * FROM users WHERE id = ?";
    
    try (Connection conn = dataSource.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setLong(1, id);  // Set parameter (1-indexed)
        
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                return user;
            }
        }
    } catch (SQLException e) {
        throw new DataAccessException("Failed to find user", e);
    }
    return null;
}

// 2. Spring JdbcTemplate (simplified)
@Repository
@RequiredArgsConstructor
public class UserRepository {
    
    private final JdbcTemplate jdbcTemplate;
    
    public User findById(Long id) {
        return jdbcTemplate.queryForObject(
            "SELECT * FROM users WHERE id = ?",
            (rs, rowNum) -> new User(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("email")
            ),
            id
        );
    }
    
    public int updateEmail(Long id, String email) {
        return jdbcTemplate.update(
            "UPDATE users SET email = ? WHERE id = ?",
            email, id
        );
    }
}

// 3. Spring Data JPA (highest abstraction - uses JDBC internally)
public interface UserRepository extends JpaRepository<User, Long> {
    // JDBC is used under the hood via Hibernate
}
```

**Key JDBC Interfaces:**

```java
// java.sql package
Connection     // Database connection
Statement      // Execute SQL (don't use - SQL injection risk)
PreparedStatement  // Parameterized SQL (use this!)
CallableStatement  // Stored procedures
ResultSet      // Query results
DataSource     // Connection factory (preferred over DriverManager)

// Example: PreparedStatement prevents SQL injection
// BAD: String sql = "SELECT * FROM users WHERE name = '" + name + "'";
// GOOD:
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE name = ?");
ps.setString(1, name);  // Safely escapes input
```

**JDBC Transaction Management:**

```java
Connection conn = dataSource.getConnection();
try {
    conn.setAutoCommit(false);  // Start transaction
    
    // Execute multiple statements
    stmt1.executeUpdate();
    stmt2.executeUpdate();
    
    conn.commit();  // Commit transaction
} catch (SQLException e) {
    conn.rollback();  // Rollback on error
    throw e;
} finally {
    conn.setAutoCommit(true);
    conn.close();
}

// Spring's @Transactional does this automatically!
@Transactional
public void transferMoney(Long from, Long to, BigDecimal amount) {
    accountRepository.debit(from, amount);
    accountRepository.credit(to, amount);
    // Auto-commit on success, auto-rollback on exception
}
```

---

#### Q2: What is HikariCP?

**Answer:**

HikariCP (光 - Japanese for "light") is a high-performance JDBC connection pool. It's the **default connection pool in Spring Boot 2.x+** due to its speed, simplicity, and reliability.

**Why Connection Pooling?**

```
┌─────────────────────────────────────────────────────────────┐
│                Without Connection Pool                       │
│                                                              │
│  Request 1 ──▶ Create Connection ──▶ Execute ──▶ Close      │
│  Request 2 ──▶ Create Connection ──▶ Execute ──▶ Close      │
│  Request 3 ──▶ Create Connection ──▶ Execute ──▶ Close      │
│                                                              │
│  Problem: Creating connections is SLOW (~50-100ms each)      │
│           High load = connection storms, DB overwhelmed      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 With Connection Pool                         │
│                                                              │
│  ┌────────────────────────────────────────────┐             │
│  │         Pool (pre-created connections)      │             │
│  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐            │             │
│  │  │ C │ │ C │ │ C │ │ C │ │ C │            │             │
│  │  └───┘ └───┘ └───┘ └───┘ └───┘            │             │
│  └────────────────────────────────────────────┘             │
│       ▲           │           ▲                              │
│       │ borrow    │ return    │ borrow                       │
│  Request 1    Request 1   Request 2                          │
│                                                              │
│  Benefit: Reuse connections, sub-millisecond acquisition     │
└─────────────────────────────────────────────────────────────┘
```

**Why HikariCP over other pools (C3P0, DBCP, Tomcat)?**

| Feature | HikariCP | C3P0 | DBCP2 | Tomcat |
|---------|----------|------|-------|--------|
| **Performance** | Fastest | Slowest | Medium | Fast |
| **Codebase** | ~130KB | ~600KB | ~200KB | ~100KB |
| **Overhead** | Minimal | High | Medium | Low |
| **Reliability** | Excellent | Good | Good | Good |
| **Active Development** | Yes | Limited | Yes | Yes |

**Key Performance Features:**

```java
// 1. ConcurrentBag - lock-free collection for connections
//    Uses ThreadLocal to avoid contention

// 2. FastList - optimized ArrayList replacement
//    Avoids range checking, faster iteration

// 3. Bytecode-level optimizations
//    Uses Javassist for runtime bytecode generation

// 4. Minimal context switching
//    Designed for multi-threaded, high-concurrency environments
```

**Basic Spring Boot Configuration:**

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    # HikariCP is auto-configured with sensible defaults
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000  # 30 seconds
```

**Monitoring HikariCP:**

```java
// Expose metrics via Actuator
@Bean
public HikariDataSource dataSource(DataSourceProperties properties) {
    HikariDataSource ds = properties.initializeDataSourceBuilder()
        .type(HikariDataSource.class)
        .build();
    ds.setPoolName("MyAppPool");
    ds.setMetricRegistry(meterRegistry);  // Micrometer metrics
    return ds;
}

// Metrics available:
// hikaricp.connections.active   - Currently in-use connections
// hikaricp.connections.idle     - Idle connections in pool
// hikaricp.connections.pending  - Threads waiting for connection
// hikaricp.connections.timeout  - Connection acquisition timeouts
```

---

#### Q3: How do you configure HikariCP for optimal performance?

**Answer:**

Tuning HikariCP is about finding the sweet spot between too few connections (requests queue up waiting) and too many connections (database gets overwhelmed, context switching kills performance). Let me walk through the key settings and how I approach tuning.

**Pool Size** is the most critical setting. The common mistake is setting it too high. More connections doesn't mean more performance - there's a point of diminishing returns, and beyond that, performance actually degrades. 

The formula I use is: `connections = (CPU cores × 2) + 1`. For an 8-core database server with SSDs, that's about 17 connections. This might seem low, but think about it - your database can only execute as many queries in parallel as it has CPU cores. Beyond that, queries queue up inside the database anyway. What actually kills performance is context switching when the database has too many concurrent connections. I've seen applications improve dramatically by reducing pool size from 100 to 20.

**Connection Timeout** controls how long a thread waits for an available connection. I set this to 30 seconds (30000ms). If you're consistently hitting this timeout, your pool is undersized or your queries are too slow - both need investigation, not just increasing the timeout.

**Max Lifetime** controls how long a connection can live before HikariCP closes and replaces it. I set this to 28-30 minutes (less than any firewall/proxy timeout and less than the database's `wait_timeout`). Stale connections cause cryptic errors, so proactively cycling them prevents issues.

**Leak Detection** is a lifesaver during development. If a connection isn't returned to the pool within the threshold (I use 60 seconds), HikariCP logs a warning with the stack trace of where the connection was borrowed. This catches code that forgets to close connections - usually a try-finally missing or a `@Transactional` scope issue.

```yaml
spring:
  datasource:
    hikari:
      # Pool sizing - start conservative, increase based on monitoring
      minimum-idle: 5                    # Keep at least 5 connections warm
      maximum-pool-size: 15              # Start with CPU cores × 2 + 1
      
      # Timeouts
      connection-timeout: 30000          # 30s max wait for connection
      idle-timeout: 600000               # Close idle connections after 10 min
      max-lifetime: 1680000              # 28 min (less than DB wait_timeout)
      
      # Health and validation
      validation-timeout: 5000           # 5s to validate a connection
      
      # Leak detection - essential for development
      leak-detection-threshold: 60000    # Warn if connection held > 1 min
      
      # Naming for metrics
      pool-name: retail-app-pool
```

When tuning, I watch these metrics: `pending` (threads waiting for connections - should be near zero), `active` vs `maximum-pool-size` (if active is consistently at max, increase pool), and `timeout` (connection acquisition failures - indicates pool exhaustion). If you're hitting timeouts, first check slow queries before blindly increasing pool size.

#### Q4: How do you solve the N+1 query problem?

**Answer:**

The N+1 problem is one of the most common performance killers in JPA applications, and honestly, it's easy to create without realizing it. Let me explain what it is and how to fix it.

The problem happens when you load a list of entities, then access a lazy-loaded relationship on each one. Say you have Orders, and each Order has a list of OrderItems. When you fetch 100 orders and then access the items for each order, JPA executes 1 query to get the orders, then 100 separate queries to get the items (one per order). That's 101 queries when you could have done it in 1 or 2.

```java
// THE PROBLEM - looks innocent but creates N+1 queries
public List<OrderDTO> getAllOrders() {
    List<Order> orders = orderRepository.findAll();  // 1 query: SELECT * FROM orders
    return orders.stream()
        .map(order -> {
            // Each call here triggers a separate query!
            // SELECT * FROM order_items WHERE order_id = ?
            List<OrderItem> items = order.getItems();  
            return new OrderDTO(order, items);
        })
        .toList();  // For 100 orders = 101 total queries
}
```

The nasty part is that this code works fine in development with 10 rows, but grinds to a halt in production with thousands of rows.

**Solution 1: JOIN FETCH** - This is my go-to solution. You explicitly tell JPA to fetch the related entities in the same query using a JOIN.

```java
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.status = :status")
List<Order> findByStatusWithItems(@Param("status") OrderStatus status);
// Executes: SELECT o.*, i.* FROM orders o JOIN order_items i ON o.id = i.order_id
```

**Solution 2: @EntityGraph** - A cleaner way to specify fetch paths without writing JPQL. I prefer this when I want different fetch strategies for different use cases.

```java
@EntityGraph(attributePaths = {"items", "items.product"})
List<Order> findByStatus(OrderStatus status);

// Or define reusable named graphs on the entity
@Entity
@NamedEntityGraph(
    name = "Order.withItems",
    attributeNodes = @NamedAttributeNode("items")
)
public class Order { }

// Then reference it
@EntityGraph(value = "Order.withItems")
List<Order> findAll();
```

**Solution 3: @BatchSize** - Instead of N queries, JPA batches them. If you set batch size to 25, instead of 100 queries for items, you get 4 queries (each loading items for 25 orders at once). This is good when you can't use JOIN FETCH (like with multiple collections, which would create a cartesian product).

```java
@Entity
public class Order {
    @OneToMany(mappedBy = "order")
    @BatchSize(size = 25)  // Fetch in batches of 25
    private List<OrderItem> items;
}
```

**Solution 4: DTO Projections** - For read-only reports, skip the entity mapping entirely. Fetch exactly the columns you need directly into a DTO. This is the most performant option when you don't need the full entity graph.

```java
@Query("""
    SELECT new com.example.dto.OrderSummaryDTO(
        o.id, o.orderNumber, o.totalAmount, 
        COUNT(i.id), c.name
    )
    FROM Order o
    JOIN o.customer c
    LEFT JOIN o.items i
    GROUP BY o.id, o.orderNumber, o.totalAmount, c.name
    """)
List<OrderSummaryDTO> findOrderSummaries();
```

To detect N+1 issues, I enable Hibernate's SQL logging during development (`spring.jpa.show-sql=true` or use p6spy) and watch for repeated similar queries. Tools like Hypersistence Optimizer can also automatically detect these problems.

---

### 10.10 API vs Event-Based Integration

#### Q1: When should you use synchronous APIs vs event-driven architecture?

**Answer:**

This is one of the most important architectural decisions in distributed systems. I'll explain when I choose each approach and why.

**Synchronous APIs (REST, gRPC)** work like a phone call - you make a request and wait for a response. Service A directly calls Service B, blocks until it responds, and then continues. This creates tight coupling - Service A needs to know Service B exists, where it is, and what interface it exposes. But it's simple to understand, easy to debug (you can trace a single request through the system), and provides immediate feedback to the user.

I use synchronous APIs when:
- The user is waiting for a response and expects immediate feedback, like "your order was placed successfully"
- I need strong consistency - the operation either fully completes or fully fails
- It's a simple query or command that doesn't need to trigger multiple downstream processes
- The downstream service is fast and reliable

**Event-driven architecture** works like sending a letter - you publish an event and move on without waiting. Service A publishes "OrderCreated" to a message queue, and any interested service (Inventory, Payment, Notification) picks it up independently. Services don't know about each other - they only know about events. This is loose coupling.

I use events when:
- Multiple services need to react to the same event - instead of Service A calling Services B, C, and D in sequence, they all react to the same event in parallel
- I can accept eventual consistency - the user might see "Order processing" and get a confirmation email later
- I need to handle failures gracefully - if the notification service is down, the order still works; notifications will be sent when it recovers
- Scalability is critical - services can scale independently based on their own load

Let me show the concrete difference. Here's synchronous order processing:

```java
@Service
public class SyncOrderService {
    
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // Block 1: Wait for inventory check (~100ms)
        InventoryResponse inventory = inventoryClient.reserve(request.getItems());
        if (!inventory.isAvailable()) {
            throw new InsufficientInventoryException();
        }
        
        // Block 2: Wait for payment (~500ms)
        PaymentResponse payment = paymentClient.charge(request.getPayment());
        if (!payment.isSuccessful()) {
            inventoryClient.release(inventory.getReservationId());
            throw new PaymentFailedException();
        }
        
        // Total: User waits ~600ms+ for response
        return orderRepository.save(Order.create(request, inventory, payment));
    }
}
```

The user waits for everything to complete. If payment service is slow or down, the whole request fails. And adding new functionality (like fraud checking) means adding more blocking calls.

Here's the event-driven version:

```java
@Service
public class AsyncOrderService {
    
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // Create order in PENDING state immediately
        Order order = Order.create(request);
        order.setStatus(OrderStatus.PENDING);
        order = orderRepository.save(order);
        
        // Publish event and return immediately
        kafkaTemplate.send("order.created", order.getId().toString(),
            new OrderCreatedEvent(order.getId(), order.getItems()));
        
        return order;  // Returns in ~50ms regardless of downstream services
    }
}

// Inventory service listens independently
@KafkaListener(topics = "order.created")
public void handleOrderCreated(OrderCreatedEvent event) {
    inventoryService.reserve(event.getOrderId(), event.getItems());
    // Publishes inventory.reserved or inventory.failed
}

// Payment service listens to inventory.reserved
@KafkaListener(topics = "inventory.reserved")
public void handleInventoryReserved(InventoryReservedEvent event) {
    paymentService.processPayment(event.getOrderId());
}
```

The user gets an immediate response ("Order placed - processing"). Each service processes independently and can be scaled, restarted, or replaced without affecting others. The tradeoff is complexity: you need to handle eventual consistency, out-of-order messages, and idempotency.

My rule of thumb: start with synchronous for simple interactions and introduce events when you see coupling problems, scalability needs, or complex multi-service workflows.

---

### 10.11 Kafka

#### Q1: How do you ensure message ordering and exactly-once delivery in Kafka?

**Answer:**

This is one of the most common Kafka interview questions, and understanding it requires knowing how Kafka's partitioning works.

**Message Ordering** in Kafka is guaranteed only within a single partition, not across partitions. A topic might have 10 partitions, and if messages for the same order go to different partitions, consumers might receive them out of order.

The solution is partition key selection. When you publish a message with a key, Kafka hashes that key and sends the message to a specific partition: `partition = hash(key) % numPartitions`. So if I use `orderId` as the key, all events for order-123 (OrderCreated, PaymentProcessed, OrderShipped) go to the same partition and are consumed in order.

```java
@Service
public class OrderEventPublisher {
    
    public void publishOrderEvent(OrderEvent event) {
        // Key = orderId ensures all events for same order go to same partition
        String key = event.getOrderId().toString();
        kafkaTemplate.send("orders", key, event);
    }
}
```

**Exactly-Once Delivery** is trickier because distributed systems are complex. Kafka provides "exactly-once semantics" (EOS) at the producer level, but you also need idempotent consumers.

On the producer side, enable idempotent producer which assigns a sequence number to each message. If a producer retries due to network issues, the broker detects duplicates and ignores them:

```java
// Producer configuration
config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
config.put(ProducerConfig.ACKS_CONFIG, "all");
config.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);
```

On the consumer side, even with producer idempotency, you can still get duplicate processing. Imagine your consumer processes a message, but crashes before committing the offset. When it restarts, it reprocesses the same message. The solution is idempotent consumer logic:

```java
@KafkaListener(topics = "orders")
@Transactional
public void handleOrder(OrderEvent event) {
    String eventId = event.getEventId();
    
    // Check if already processed
    if (processedEventRepository.existsById(eventId)) {
        log.info("Event already processed: {}", eventId);
        return;  // Skip duplicate
    }
    
    // Process event
    orderService.process(event);
    
    // Record that we processed it
    processedEventRepository.save(new ProcessedEvent(eventId, Instant.now()));
}
```

For failed messages that keep retrying, I use a **Dead Letter Queue (DLQ)**. After N retries, the message goes to a separate topic (like `orders.dlq`) for manual inspection instead of blocking the consumer forever.

---// All order-123 events go to Partition 2 → ordered consumption
```

**Exactly-Once Semantics:**

```java
// Producer: Enable idempotent producer
@Configuration
public class KafkaProducerConfig {
    
    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        
        // Idempotent producer (prevents duplicates on retry)
        config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);
        config.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 5);
        
        return new DefaultKafkaProducerFactory<>(config);
    }
}

// Consumer: Idempotent processing
@Service
@RequiredArgsConstructor
public class IdempotentConsumer {
    
    private final ProcessedEventRepository processedEventRepository;
    
    @KafkaListener(topics = "orders")
    @Transactional
    public void handle(OrderEvent event, Acknowledgment ack) {
        String eventId = event.getEventId();
        
        // Check if already processed (idempotency check)
        if (processedEventRepository.existsById(eventId)) {
            log.info("Event already processed: {}", eventId);
            ack.acknowledge();
            return;
        }
        
        try {
            // Process event
            orderService.process(event);
            
            // Mark as processed
            processedEventRepository.save(new ProcessedEvent(eventId, Instant.now()));
            
            // Acknowledge
            ack.acknowledge();
        } catch (Exception e) {
            // Don't acknowledge - will be retried or sent to DLQ
            throw e;
        }
    }
}
```

**Dead Letter Queue (DLQ):**

```java
@Configuration
public class KafkaConsumerConfig {
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> 
            kafkaListenerContainerFactory(KafkaTemplate<String, Object> template) {
        
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        
        // Error handling with DLQ
        factory.setCommonErrorHandler(new DefaultErrorHandler(
            new DeadLetterPublishingRecoverer(template,
                (record, ex) -> new TopicPartition(record.topic() + ".dlq", 0)),
            new FixedBackOff(1000L, 3)  // 3 retries, 1 second apart
        ));
        
        return factory;
    }
}
```

---

### 10.12 Relational Databases & Schema Design

#### Q1: How do you design a database schema for a multi-tenant application?

**Answer:**

Multi-tenancy is how SaaS applications serve multiple customers (tenants) from the same codebase. The key question is how to isolate tenant data. Let me explain the three main strategies I've used.

**Shared Database, Shared Schema** is the simplest approach - all tenants share the same tables, with a `tenant_id` column on every row. This is cost-effective and easy to manage operationally (one database to back up, one set of tables to migrate). However, isolation is your responsibility - every query must filter by tenant_id, and a bug could leak data between tenants. I use this for most SaaS products where tenants are small-to-medium size and strong isolation isn't a regulatory requirement.

```java
@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_order_tenant", columnList = "tenant_id, status")
})
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;  // EVERY table has this
    
    private String orderNumber;
    private BigDecimal totalAmount;
}
```

To prevent forgetting the tenant filter, I use Hibernate's `@Filter` which automatically adds the WHERE clause:

```java
@Entity
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = UUID.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class Order { }
```

**Shared Database, Separate Schema** gives each tenant their own PostgreSQL schema (like namespaces within the same database). Queries don't need `tenant_id` because each tenant sees only their schema. Better isolation, but migrations become more complex - you need to apply changes to every schema. I use this when tenants need moderate isolation or when they want to feel like they have their own database.

**Separate Database** provides complete isolation - each tenant gets their own database. Data is completely segregated, performance is isolated (one busy tenant can't slow others), and you can even put important tenants on dedicated hardware. But it's expensive, complex to operate (imagine managing backups and migrations for 100+ databases), and connection pooling becomes tricky. I use this for enterprise customers with strict compliance requirements or very large data volumes.

For shared schema with PostgreSQL, I also use Row-Level Security (RLS) as a database-level safety net:

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy enforces tenant isolation at DB level
CREATE POLICY tenant_isolation ON orders
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Application sets context per connection
SET app.tenant_id = '550e8400-e29b-41d4-a716-446655440000';
```

Even if application code has a bug, the database won't return other tenants' data. This defense-in-depth approach is valuable for data-sensitive applications.

---

#### Q2: How do you handle database migrations safely?

**Answer:**

Database migrations in production require careful planning because you can't just stop the world, change the schema, and restart. Applications are running, users are making requests, and you need zero-downtime deployments.

I use Flyway for versioned migrations, and I follow strict safety practices. The key principles are: don't take locks, make changes backward compatible, and deploy in phases.

**Safe Operations** that don't lock tables:
- Adding a nullable column
- Adding an index with CONCURRENTLY
- Creating new tables
- Adding or changing default values

**Dangerous Operations** that can lock tables or cause issues:
- Adding a NOT NULL column (requires rewriting the table)
- Renaming a column (breaks running code)
- Dropping a column (breaks running code)
- Adding a unique constraint on existing data

For dangerous operations, I break them into multiple phases. Here's how I safely add a required column:

```sql
-- Phase 1: Add nullable column (instant, no lock)
-- V1__add_status_nullable.sql
ALTER TABLE users ADD COLUMN status VARCHAR(50);

-- Phase 2: Backfill existing data (can be batched for large tables)
-- V2__backfill_status.sql
UPDATE users SET status = 'ACTIVE' WHERE status IS NULL;

-- Phase 3: Make column required (after backfill complete)
-- V3__make_status_required.sql
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'ACTIVE';
```

For renaming a column (which would break running code), I use an expand-contract pattern:

1. **Expand**: Add the new column, keep the old one
2. **Migrate Data**: Copy data from old to new, update code to write both
3. **Verify**: Ensure new column has all data
4. **Switch Reads**: Update code to read from new column
5. **Contract**: Remove the old column (in a later deployment)

For indexes on large tables, always use CONCURRENTLY:

```sql
-- This doesn't block writes
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

Without CONCURRENTLY, creating an index locks the table for writes, which can mean minutes of downtime on a large table.

Finally, I always test migrations on a production-like dataset before deploying to production. A migration that takes 1 second on 1000 rows might take 10 minutes on 10 million rows.

---│                                                              │
│  6. Remove old column (separate migration)                  │
│     ALTER TABLE users DROP COLUMN name;                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Final Summary: Interview Answer Template

When answering interview questions, use this structure:

**1. Define/Explain** - What is it?
**2. Why/When** - Why use it? When is it appropriate?
**3. How** - How does it work? Show code if possible.
**4. Trade-offs** - What are the pros/cons?
**5. Real Experience** - Share relevant experience (if applicable)

**Example Answer for "How do you handle caching?":**

> "I use Redis with the cache-aside pattern for read-heavy data. The application first checks the cache, and on a miss, fetches from the database and populates the cache with a TTL.
>
> For cache invalidation, I combine time-based expiration (1-hour TTL) with event-driven invalidation using Spring's @CacheEvict when data is updated.
>
> To prevent cache stampede, I use distributed locks with Redis when rebuilding expensive cache entries. The main trade-off is added complexity and eventual consistency, which is acceptable for our read-heavy catalog service but not for inventory counts where we need strong consistency."

---

*Last Updated: April 2026*
