from abc import ABC, abstractmethod


class HookTemplate(ABC):
    'Abstract class that serves as a template for network hooks'

    @abstractmethod
    def argumentscheck(self):
        pass

    @abstractmethod
    def connect(self):
        pass
