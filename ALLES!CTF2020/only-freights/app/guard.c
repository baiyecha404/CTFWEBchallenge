#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

unsigned int csrng() {
    unsigned int number;
    FILE* f = fopen("/dev/urandom", "r");
    if (!f) {
        printf("Could not open /dev/urandom!\n");
        exit(1);
    }
    size_t read = fread(&number, 1, sizeof number, f);
    if (read != sizeof number) {
        printf("Could not read enough randomness!\n");
        exit(1);
    }
    return number;
}

int is_interactive() {
    unsigned int a, b, c;
    a = csrng();
    b = csrng();
    printf("%u + %u = ", a, b);
    fscanf(stdin, "%u", &c);
    return a + b == c;
}

void print_flag() {
    seteuid(0);
    char flag[256];
    FILE* f = fopen("/flag.txt", "r");
    if (!f) {
        printf("Could not open the flag file!\n");
        exit(1);
    }
    size_t read = fread(flag, 1, sizeof flag, f);
    flag[read] = (char) 0;
    printf("%s\n", flag);
}

int main() {
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);

    if (is_interactive()) {
        print_flag();
    } else {
        printf("Wrong!\n");
        exit(1);
    }
}
