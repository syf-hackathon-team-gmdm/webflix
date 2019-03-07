![](./.gitlab/logo.png)

# webflix

## Dependencies

```bash
~$ make deps
```

## Build

1. Build **webflix.js** and **webflix.css** library:

```bash
~$ make webflix.css  # ./build
~$ make webflix.js   # ./build
```

2. Build browser extension:

```bash
~$ make chrome && make firefox  # ./build
```

## License

**webflix** is under [MIT License](./LICENSE).
