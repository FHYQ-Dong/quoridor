export type Callback = () => void;

export type CounterCallback = (c: number) => void;

export default function timer(seconds: number, onElapsed: Callback, onInterval: CounterCallback): Callback {
    let next = Date.now() + 100;
    let counter = seconds * 10;
    const interval = () => {
        next += 100;
        counter -= 1;
        onInterval(counter);
        if (counter <= 0) {
            onElapsed();
            return;
        }
        handle = setTimeout(interval, next - Date.now());
    }
    let handle = setTimeout(interval, next-Date.now());
    return () => clearTimeout(handle);
}