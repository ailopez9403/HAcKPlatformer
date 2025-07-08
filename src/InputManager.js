class InputManager
{
    observer = [];

    subscribe(fn) {
        this.observer.push(fn);
    }
    unsubscribe(fn) {
        this.observer = this.observer.filter(subscriber => subscriber !== fn);
    }

    broadcast(action) {
        this.observer.forEach(subscriber => subscriber(action));
    }

    handleKeyDown = e => {
        e.preventDefault();
        switch (e.keyCode)
        {
            //left-arrow
            case 37:
                this.broadcast('moveLeft');
                break;
            //up-arrow?
            case 38:    
                this.broadcast('jump');
                break;
            case 39:
                this.broadcast('moveRight');
                break;
            default:
                break;    
        }
    };

    handleKeyUp = e => {
        e.preventDefault();
        switch (e.keyCode)
        {
            case 37:
                this.broadcast('stopLeft');
                break;
            case 39: 
                this.broadcast('stopRight');
                break;
            default:
                break;
        }
    };

    bindKeys() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }
    unbindKeys() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}

export default InputManager;
